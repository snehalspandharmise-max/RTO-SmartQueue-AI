import { QueueService } from '../services/queueService.js';
import { inMemoryDB } from '../config/db.js';

export class QueueController {
  /**
   * Get the active queue tracker for the citizen's most relevant appointment
   */
  static getMyQueue(req, res, next) {
    try {
      // Find the citizen's active appointment (waiting, in_progress, checked_in, or booked)
      const myActiveAppt = inMemoryDB.findOne('appointments', a => 
        a.user_id === req.user.id && 
        ['waiting', 'in_progress', 'checked_in', 'booked'].includes(a.status)
      );

      if (!myActiveAppt) {
        return res.json({
          hasActiveQueue: false,
          message: 'No active queue ticket found for today.'
        });
      }

      const queueData = QueueService.getQueueTracker(myActiveAppt.id, req.user);
      res.json({
        hasActiveQueue: true,
        ...queueData
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get queue status for a specific appointment
   */
  static getQueueByAppointmentId(req, res, next) {
    try {
      const queueData = QueueService.getQueueTracker(req.params.appointmentId, req.user);
      res.json(queueData);
    } catch (err) {
      next(err);
    }
  }
}
