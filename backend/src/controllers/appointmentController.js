
import { AppointmentService } from '../services/appointmentService.js';
import { QueueService } from '../services/queueService.js';

export class AppointmentController {
  static async getMyAppointments(req, res, next) {
    try {
      const appointments = await AppointmentService.getUserAppointments(req.user.id);
      res.json({ appointments });
    } catch (err) {
      next(err);
    }
  }

  static async getAppointmentById(req, res, next) {
    try {
      const appointment = await AppointmentService.getAppointmentById(
        req.params.id,
        req.user
      );

      if (!appointment) {
        return res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Appointment not found' }
        });
      }

      res.json({ appointment });
    } catch (err) {
      next(err);
    }
  }

  static async bookAppointment(req, res, next) {
    try {
      const { office_id, service_id, slot_id, notes } = req.body;

      if (!office_id || !service_id || !slot_id) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'office_id, service_id, and slot_id are required.'
          }
        });
      }

      const result = await AppointmentService.bookAppointment({
        userId: req.user.id,
        officeId: office_id,
        serviceId: service_id,
        slotId: slot_id,
        notes
      });

      res.status(201).json({
        message: 'Appointment booked successfully',
        ...result
      });
    } catch (err) {
      next(err);
    }
  }

  static async checkIn(req, res, next) {
    try {
      const result = await QueueService.checkIn(req.params.id, req.user);

      res.json({
        message: 'Checked in successfully. You have joined the active queue.',
        ...result
      });
    } catch (err) {
      next(err);
    }
  }

  static async reschedule(req, res, next) {
    try {
      const { new_slot_id } = req.body;

      if (!new_slot_id) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'new_slot_id is required'
          }
        });
      }

      const updated = await AppointmentService.rescheduleAppointment(
        req.params.id,
        req.user,
        new_slot_id
      );

      res.json({
        message: 'Appointment rescheduled successfully',
        appointment: updated
      });
    } catch (err) {
      next(err);
    }
  }

  static async cancel(req, res, next) {
    try {
      const { reason } = req.body;

      const updated = await AppointmentService.cancelAppointment(
        req.params.id,
        req.user,
        reason
      );

      res.json({
        message: 'Appointment cancelled successfully',
        appointment: updated
      });
    } catch (err) {
      next(err);
    }
  }
}
