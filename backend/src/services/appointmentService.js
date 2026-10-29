import crypto from 'node:crypto';
import { inMemoryDB } from '../config/db.js';
import { PredictionService } from './predictionService.js';

/**
 * Appointment Booking & Management Service
 * Enforces atomic slot capacity, unique tokens, and lifecycle constraints.
 */
export class AppointmentService {
  /**
   * Book an appointment with concurrency protection and atomic capacity decrement
   */
  static bookAppointment({ userId, officeId, serviceId, slotId, notes = '' }) {
    // 1. Verify user profile exists
    const user = inMemoryDB.findById('profiles', userId);
    if (!user) {
      throw new Error('User profile not found');
    }

    // 2. Verify office and service
    const office = inMemoryDB.findById('rto_offices', officeId);
    if (!office || !office.is_active) {
      throw new Error('Selected RTO Office is not available');
    }

    const service = inMemoryDB.findById('services', serviceId);
    if (!service || !service.is_active) {
      throw new Error('Selected Service is not available');
    }

    // 3. Atomic Slot Capacity Verification
    const slot = inMemoryDB.findById('appointment_slots', slotId);
    if (!slot || !slot.is_active) {
      throw new Error('Selected appointment slot does not exist or is inactive');
    }

    if (slot.booked_count >= slot.max_capacity) {
      const err = new Error('Selected appointment slot is fully booked. Please choose another time slot.');
      err.code = 'SLOT_FULL';
      err.statusCode = 409;
      throw err;
    }

    // 4. Duplicate Active Booking Guard
    const existingActive = inMemoryDB.findOne('appointments', a => 
      a.user_id === userId && 
      a.service_id === serviceId && 
      (a.status === 'booked' || a.status === 'checked_in' || a.status === 'waiting')
    );
    if (existingActive) {
      const err = new Error('You already have an active appointment for this service.');
      err.code = 'DUPLICATE_ACTIVE_BOOKING';
      err.statusCode = 409;
      throw err;
    }

    // 5. Atomic increment of booked count
    inMemoryDB.update('appointment_slots', slot.id, {
      booked_count: slot.booked_count + 1
    });

    // 6. Generate Unguessable Booking Reference & Scope-Safe Daily Queue Token
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    const bookingReference = `BK-${Date.now().toString().slice(-4)}${randomHex}`;

    // Compute next token number for this office, service, and date
    const todayTokens = inMemoryDB.findAll('appointments', a => 
      a.office_id === officeId && 
      a.token_date === slot.slot_date
    );
    const nextTokenNum = 101 + todayTokens.length;
    const queueToken = `${service.service_code}-${nextTokenNum}`;

    // 7. Calculate initial wait-time prediction
    const waitPred = PredictionService.calculateWaitTime({
      officeId,
      serviceId,
      queuePosition: slot.booked_count
    });

    // 8. Insert Appointment Record
    const appointment = inMemoryDB.insert('appointments', {
      user_id: userId,
      office_id: officeId,
      service_id: serviceId,
      slot_id: slotId,
      counter_id: null,
      booking_reference: bookingReference,
      queue_token: queueToken,
      token_number: nextTokenNum,
      token_date: slot.slot_date,
      status: 'booked',
      notes,
      predicted_wait_at_checkin: waitPred.estimatedWaitMinutes,
      actual_wait_minutes: null,
      actual_service_minutes: null,
      checked_in_at: null,
      service_started_at: null,
      service_completed_at: null
    });

    // 9. Save Queue Event & Prediction Snapshot
    inMemoryDB.insert('queue_events', {
      appointment_id: appointment.id,
      from_status: null,
      to_status: 'booked',
      actor_id: userId,
      metadata: { bookingReference, slotTime: slot.start_time }
    });

    PredictionService.recordSnapshot(appointment.id, waitPred);

    // 10. Generate In-App Notification
    inMemoryDB.insert('notifications', {
      user_id: userId,
      appointment_id: appointment.id,
      notification_type: 'BOOKING_CONFIRMED',
      title: 'Appointment Confirmed',
      message: `Your appointment for ${service.name} at ${office.office_name} is confirmed. Booking Ref: ${bookingReference}, Token: ${queueToken}.`,
      is_read: false
    });

    return {
      appointment,
      slot,
      service,
      office,
      prediction: waitPred
    };
  }

  /**
   * Cancel an appointment following business rules
   */
  static cancelAppointment(appointmentId, user, reason = '') {
    const appt = inMemoryDB.findById('appointments', appointmentId);
    if (!appt) {
      throw new Error(`Appointment ${appointmentId} not found`);
    }

    // Role verification: citizen can only cancel their own appointment
    if (user.role !== 'admin' && appt.user_id !== user.id) {
      const err = new Error('Unauthorized to cancel this appointment.');
      err.statusCode = 403;
      throw err;
    }

    if (appt.status !== 'booked') {
      const err = new Error(`Cannot cancel appointment in '${appt.status}' state. Only 'booked' appointments can be cancelled.`);
      err.statusCode = 400;
      throw err;
    }

    // Update appointment status
    const updated = inMemoryDB.update('appointments', appointmentId, {
      status: 'cancelled',
      notes: reason ? `${appt.notes || ''} [Cancelled: ${reason}]`.trim() : appt.notes
    });

    // Restore slot capacity
    const slot = inMemoryDB.findById('appointment_slots', appt.slot_id);
    if (slot && slot.booked_count > 0) {
      inMemoryDB.update('appointment_slots', slot.id, {
        booked_count: slot.booked_count - 1
      });
    }

    // Log event and send notification
    inMemoryDB.insert('queue_events', {
      appointment_id: appointmentId,
      from_status: 'booked',
      to_status: 'cancelled',
      actor_id: user.id,
      metadata: { reason }
    });

    inMemoryDB.insert('notifications', {
      user_id: appt.user_id,
      appointment_id: appointmentId,
      notification_type: 'APPOINTMENT_CANCELLED',
      title: 'Appointment Cancelled',
      message: `Your appointment ${appt.booking_reference} has been cancelled successfully.`,
      is_read: false
    });

    return updated;
  }

  /**
   * Reschedule an appointment to a new available slot
   */
  static rescheduleAppointment(appointmentId, user, newSlotId) {
    const appt = inMemoryDB.findById('appointments', appointmentId);
    if (!appt) {
      throw new Error(`Appointment ${appointmentId} not found`);
    }

    if (user.role !== 'admin' && appt.user_id !== user.id) {
      const err = new Error('Unauthorized to reschedule this appointment.');
      err.statusCode = 403;
      throw err;
    }

    if (appt.status !== 'booked') {
      const err = new Error(`Cannot reschedule appointment in '${appt.status}' state.`);
      err.statusCode = 400;
      throw err;
    }

    const newSlot = inMemoryDB.findById('appointment_slots', newSlotId);
    if (!newSlot || !newSlot.is_active) {
      throw new Error('Target appointment slot does not exist');
    }

    if (newSlot.booked_count >= newSlot.max_capacity) {
      const err = new Error('Target appointment slot is fully booked.');
      err.statusCode = 409;
      throw err;
    }

    // Atomic release of old slot and reservation of new slot
    const oldSlot = inMemoryDB.findById('appointment_slots', appt.slot_id);
    if (oldSlot && oldSlot.booked_count > 0) {
      inMemoryDB.update('appointment_slots', oldSlot.id, { booked_count: oldSlot.booked_count - 1 });
    }
    inMemoryDB.update('appointment_slots', newSlot.id, { booked_count: newSlot.booked_count + 1 });

    const updated = inMemoryDB.update('appointments', appointmentId, {
      slot_id: newSlot.id,
      token_date: newSlot.slot_date
    });

    inMemoryDB.insert('queue_events', {
      appointment_id: appointmentId,
      from_status: 'booked',
      to_status: 'booked',
      actor_id: user.id,
      metadata: { oldSlotId: oldSlot?.id, newSlotId: newSlot.id }
    });

    inMemoryDB.insert('notifications', {
      user_id: appt.user_id,
      appointment_id: appointmentId,
      notification_type: 'APPOINTMENT_RESCHEDULED',
      title: 'Appointment Rescheduled',
      message: `Your appointment ${appt.booking_reference} is rescheduled to ${newSlot.slot_date} at ${newSlot.start_time.substring(0, 5)}.`,
      is_read: false
    });

    return updated;
  }

  /**
   * Get citizen's appointments with hydrated relations
   */
  static getUserAppointments(userId) {
    const appts = inMemoryDB.findAll('appointments', a => a.user_id === userId);
    return appts.map(a => this.hydrateAppointment(a));
  }

  /**
   * Get appointment by ID with role authorization check
   */
  static getAppointmentById(appointmentId, user) {
    const appt = inMemoryDB.findById('appointments', appointmentId);
    if (!appt) return null;

    if (user.role !== 'admin' && appt.user_id !== user.id) {
      const err = new Error('Access denied. You cannot view another citizen\'s appointment.');
      err.statusCode = 403;
      throw err;
    }

    return this.hydrateAppointment(appt);
  }

  /**
   * Helper to attach office, service, slot, and counter entities
   */
  static hydrateAppointment(appt) {
    const office = inMemoryDB.findById('rto_offices', appt.office_id);
    const service = inMemoryDB.findById('services', appt.service_id);
    const slot = inMemoryDB.findById('appointment_slots', appt.slot_id);
    const counter = appt.counter_id ? inMemoryDB.findById('counters', appt.counter_id) : null;

    return {
      ...appt,
      office,
      service,
      slot,
      counter
    };
  }
}
