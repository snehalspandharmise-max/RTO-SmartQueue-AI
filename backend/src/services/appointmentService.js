
import { supabase } from '../config/db.js';

/**
 * Appointment Booking & Management Service
 * Uses Supabase PostgreSQL instead of in-memory appointment storage.
 */

export class AppointmentService {
  static ensureDatabase() {
    if (!supabase) {
      throw new Error('Supabase database is not configured.');
    }
  }

  static handleDatabaseError(error) {
    const err = new Error(error.message || 'Database operation failed.');

    if (
      error.code === '23505' ||
      error.message?.toLowerCase().includes('already have an active appointment')
    ) {
      err.code = 'DUPLICATE_ACTIVE_BOOKING';
      err.statusCode = 409;
    } else if (
      error.message?.toLowerCase().includes('fully booked') ||
      error.message?.toLowerCase().includes('capacity')
    ) {
      err.code = 'SLOT_FULL';
      err.statusCode = 409;
    } else if (error.code === 'P0001') {
      err.statusCode = 400;
    } else {
      err.statusCode = 500;
    }

    throw err;
  }

  /**
   * Book an appointment through the PostgreSQL RPC function.
   */
  static async bookAppointment({
    userId,
    officeId,
    serviceId,
    slotId,
    notes = ''
  }) {
    this.ensureDatabase();

    const { data, error } = await supabase.rpc(
      'book_rto_appointment',
      {
        p_user_id: userId,
        p_office_id: officeId,
        p_service_id: serviceId,
        p_slot_id: slotId,
        p_notes: notes
      }
    );

    if (error) {
      this.handleDatabaseError(error);
    }

    if (!data?.appointment?.id) {
      throw new Error('Booking was processed, but the appointment details could not be retrieved.');
    }

    const appointment = await this.hydrateAppointment(data.appointment);

    return {
      appointment,
      slot: appointment.slot,
      service: appointment.service,
      office: appointment.office,
      prediction: {
        estimatedWaitMinutes: null,
        confidenceLabel: 'Pending',
        explanation: 'Wait-time prediction will be calculated using the connected queue data.'
      },
      booking_reference: data.booking_reference,
      queue_token: data.queue_token,
      token_number: data.token_number
    };
  }

  /**
   * Cancel an appointment.
   * Uses a PostgreSQL RPC function to update appointment and slot capacity safely.
   */
  static async cancelAppointment(appointmentId, user, reason = '') {
    this.ensureDatabase();

    const { data, error } = await supabase.rpc(
      'cancel_rto_appointment',
      {
        p_appointment_id: appointmentId,
        p_user_id: user.id,
        p_actor_id: user.id,
        p_reason: reason
      }
    );

    if (error) {
      this.handleDatabaseError(error);
    }

    const updatedAppointment = data?.appointment || data;

    if (!updatedAppointment?.id) {
      throw new Error('Appointment cancellation did not return updated appointment details.');
    }

    return await this.hydrateAppointment(updatedAppointment);
  }

  /**
   * Reschedule an appointment.
   * Uses a PostgreSQL RPC function to release and reserve slot capacity safely.
   */
  static async rescheduleAppointment(appointmentId, user, newSlotId) {
    this.ensureDatabase();

    const { data, error } = await supabase.rpc(
      'reschedule_rto_appointment',
      {
        p_appointment_id: appointmentId,
        p_user_id: user.id,
        p_actor_id: user.id,
        p_new_slot_id: newSlotId
      }
    );

    if (error) {
      this.handleDatabaseError(error);
    }

    const updatedAppointment = data?.appointment || data;

    if (!updatedAppointment?.id) {
      throw new Error('Rescheduling did not return updated appointment details.');
    }

    return await this.hydrateAppointment(updatedAppointment);
  }

  /**
   * Get all appointments belonging to a citizen.
   */
  static async getUserAppointments(userId) {
    this.ensureDatabase();

    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      this.handleDatabaseError(error);
    }

    return await Promise.all(
      (data || []).map(appointment => this.hydrateAppointment(appointment))
    );
  }

  /**
   * Get an appointment by ID with authorization.
   */
  static async getAppointmentById(appointmentId, user) {
    this.ensureDatabase();

    const { data: appointment, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .maybeSingle();

    if (error) {
      this.handleDatabaseError(error);
    }

    if (!appointment) {
      return null;
    }

    if (user.role !== 'admin' && appointment.user_id !== user.id) {
      const err = new Error(
        'Access denied. You cannot view another citizen’s appointment.'
      );
      err.statusCode = 403;
      throw err;
    }

    return await this.hydrateAppointment(appointment);
  }

  /**
   * Attach office, service, slot and counter information.
   */
  static async hydrateAppointment(appointment) {
    this.ensureDatabase();

    const [
      officeResult,
      serviceResult,
      slotResult,
      counterResult
    ] = await Promise.all([
      supabase
        .from('rto_offices')
        .select('*')
        .eq('id', appointment.office_id)
        .maybeSingle(),

      supabase
        .from('services')
        .select('*')
        .eq('id', appointment.service_id)
        .maybeSingle(),

      supabase
        .from('appointment_slots')
        .select('*')
        .eq('id', appointment.slot_id)
        .maybeSingle(),

      appointment.counter_id
        ? supabase
            .from('counters')
            .select('*')
            .eq('id', appointment.counter_id)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null })
    ]);

    const results = [
      officeResult,
      serviceResult,
      slotResult,
      counterResult
    ];

    const failedResult = results.find(result => result.error);

    if (failedResult) {
      this.handleDatabaseError(failedResult.error);
    }

    return {
      ...appointment,
      office: officeResult.data,
      service: serviceResult.data,
      slot: slotResult.data,
      counter: counterResult.data
    };
  }
}
