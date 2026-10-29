import { inMemoryDB } from '../config/db.js';
import { PredictionService } from './predictionService.js';
import { AppointmentService } from './appointmentService.js';

/**
 * Queue Progression and State Machine Service
 * Enforces valid lifecycle transitions and real-time waiting metric updates.
 */
export class QueueService {
  /**
   * Allowed state transitions map
   */
  static VALID_TRANSITIONS = {
    booked: ['checked_in', 'cancelled'],
    checked_in: ['waiting', 'cancelled'],
    waiting: ['in_progress', 'no_show', 'cancelled'],
    in_progress: ['completed', 'no_show'],
    completed: [],
    cancelled: [],
    no_show: []
  };

  /**
   * Citizen self-service or QR kiosk check-in
   */
  static checkIn(appointmentId, user) {
    const appt = inMemoryDB.findById('appointments', appointmentId);
    if (!appt) {
      throw new Error(`Appointment ${appointmentId} not found`);
    }

    if (user.role !== 'admin' && appt.user_id !== user.id) {
      const err = new Error('Unauthorized to check in this appointment.');
      err.statusCode = 403;
      throw err;
    }

    if (appt.status !== 'booked') {
      const err = new Error(`Cannot check in an appointment in '${appt.status}' state.`);
      err.statusCode = 400;
      throw err;
    }

    const now = new Date().toISOString();
    const waitPred = PredictionService.calculateWaitTime({
      officeId: appt.office_id,
      serviceId: appt.service_id,
      appointmentId
    });

    // Advance to waiting
    const updated = inMemoryDB.update('appointments', appointmentId, {
      status: 'waiting',
      checked_in_at: now,
      predicted_wait_at_checkin: waitPred.estimatedWaitMinutes
    });

    inMemoryDB.insert('queue_events', {
      appointment_id: appointmentId,
      from_status: 'booked',
      to_status: 'waiting',
      actor_id: user.id,
      metadata: { checkInTime: now, predictedWaitMinutes: waitPred.estimatedWaitMinutes }
    });

    PredictionService.recordSnapshot(appointmentId, waitPred);

    inMemoryDB.insert('notifications', {
      user_id: appt.user_id,
      appointment_id: appointmentId,
      notification_type: 'STATUS_CHANGED',
      title: 'Checked In Successfully',
      message: `Token ${appt.queue_token} is now waiting in queue. Estimated wait: ${waitPred.lowerBoundMinutes}-${waitPred.upperBoundMinutes} minutes.`,
      is_read: false
    });

    return {
      appointment: AppointmentService.hydrateAppointment(updated),
      prediction: waitPred
    };
  }

  /**
   * Administrator advances appointment status along the queue lifecycle
   */
  static advanceStatus(appointmentId, newStatus, adminUser, { counterId = null, notes = '' } = {}) {
    const appt = inMemoryDB.findById('appointments', appointmentId);
    if (!appt) {
      throw new Error(`Appointment ${appointmentId} not found`);
    }

    const allowed = this.VALID_TRANSITIONS[appt.status] || [];
    if (!allowed.includes(newStatus)) {
      const err = new Error(`Invalid status transition from '${appt.status}' to '${newStatus}'. Allowed: [${allowed.join(', ')}]`);
      err.statusCode = 400;
      throw err;
    }

    const now = new Date();
    const updates = { status: newStatus };
    if (notes) updates.notes = notes;

    // Transition-specific logic
    if (newStatus === 'in_progress') {
      const assignedCounterId = counterId || appt.counter_id;
      if (!assignedCounterId) {
        // Automatically find first active available counter for this service
        const counterServices = inMemoryDB.findAll('counter_services', cs => cs.service_id === appt.service_id);
        const eligibleIds = new Set(counterServices.map(cs => cs.counter_id));
        const freeCounter = inMemoryDB.findOne('counters', c => 
          c.office_id === appt.office_id && 
          c.status === 'active' && 
          eligibleIds.has(c.id) &&
          !c.current_appointment_id
        );
        updates.counter_id = freeCounter ? freeCounter.id : null;
      } else {
        updates.counter_id = assignedCounterId;
      }

      updates.service_started_at = now.toISOString();

      // Calculate actual waiting time if check-in timestamp exists
      if (appt.checked_in_at) {
        const checkInMs = new Date(appt.checked_in_at).getTime();
        updates.actual_wait_minutes = parseFloat(((now.getTime() - checkInMs) / 60000).toFixed(1));
      }

      // Mark counter busy
      if (updates.counter_id) {
        inMemoryDB.update('counters', updates.counter_id, {
          current_appointment_id: appointmentId
        });
      }

      inMemoryDB.insert('notifications', {
        user_id: appt.user_id,
        appointment_id: appointmentId,
        notification_type: 'TOKEN_CALLED',
        title: 'Now Serving!',
        message: `Token ${appt.queue_token} is called. Please proceed to the counter.`,
        is_read: false
      });
    } else if (newStatus === 'completed') {
      updates.service_completed_at = now.toISOString();

      if (appt.service_started_at) {
        const startMs = new Date(appt.service_started_at).getTime();
        updates.actual_service_minutes = parseFloat(((now.getTime() - startMs) / 60000).toFixed(1));
      }

      // Free counter
      if (appt.counter_id) {
        inMemoryDB.update('counters', appt.counter_id, {
          current_appointment_id: null
        });
      }

      inMemoryDB.insert('notifications', {
        user_id: appt.user_id,
        appointment_id: appointmentId,
        notification_type: 'SERVICE_COMPLETED',
        title: 'Service Completed',
        message: `Your service for Token ${appt.queue_token} has been successfully completed.`,
        is_read: false
      });
    } else if (newStatus === 'no_show') {
      if (appt.counter_id) {
        inMemoryDB.update('counters', appt.counter_id, {
          current_appointment_id: null
        });
      }

      inMemoryDB.insert('notifications', {
        user_id: appt.user_id,
        appointment_id: appointmentId,
        notification_type: 'NO_SHOW',
        title: 'Marked No-Show',
        message: `Appointment ${appt.booking_reference} (Token ${appt.queue_token}) was marked as No-Show.`,
        is_read: false
      });
    }

    const updated = inMemoryDB.update('appointments', appointmentId, updates);

    // Queue event
    inMemoryDB.insert('queue_events', {
      appointment_id: appointmentId,
      from_status: appt.status,
      to_status: newStatus,
      actor_id: adminUser.id,
      metadata: { adminEmail: adminUser.email, updates }
    });

    // Audit log
    inMemoryDB.insert('audit_logs', {
      actor_id: adminUser.id,
      action: 'UPDATE_QUEUE_STATUS',
      target_type: 'appointment',
      target_id: appointmentId,
      change_summary: {
        from: appt.status,
        to: newStatus,
        token: appt.queue_token
      },
      ip_address: '127.0.0.1'
    });

    return AppointmentService.hydrateAppointment(updated);
  }

  /**
   * Get real-time queue tracker data for an appointment
   */
  static getQueueTracker(appointmentId, user) {
    const appt = AppointmentService.getAppointmentById(appointmentId, user);
    if (!appt) {
      throw new Error(`Appointment ${appointmentId} not found`);
    }

    const prediction = PredictionService.calculateWaitTime({
      officeId: appt.office_id,
      serviceId: appt.service_id,
      appointmentId
    });

    // Active counters authorized for this service
    const authorized = inMemoryDB.findAll('counter_services', cs => cs.service_id === appt.service_id);
    const authIds = new Set(authorized.map(cs => cs.counter_id));
    const activeCounters = inMemoryDB.findAll('counters', c => 
      c.office_id === appt.office_id && 
      c.status === 'active' && 
      authIds.has(c.id)
    );

    return {
      appointment: appt,
      prediction,
      activeCountersCount: activeCounters.length,
      currentStatus: appt.status,
      queueAhead: prediction.factorsUsed?.queueAhead ?? 0,
      lastCalculationTime: prediction.calculationTimestamp
    };
  }
}
