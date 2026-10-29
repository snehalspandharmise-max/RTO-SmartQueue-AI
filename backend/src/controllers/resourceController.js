import { inMemoryDB } from '../config/db.js';
import { PredictionService } from '../services/predictionService.js';
import { RecommendationService } from '../services/recommendationService.js';

export class ResourceController {
  static getOffices(req, res) {
    const offices = inMemoryDB.findAll('rto_offices', o => o.is_active);
    res.json({ offices });
  }

  static getServices(req, res) {
    const services = inMemoryDB.findAll('services', s => s.is_active);
    res.json({ services });
  }

  static getOfficeServices(req, res) {
    const { officeId } = req.params;
    const services = inMemoryDB.findAll('services', s => s.is_active);
    res.json({ services, officeId });
  }

  static getSlots(req, res) {
    const { officeId, serviceId, date, preferredWindow } = req.query;

    if (!officeId || !serviceId) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'officeId and serviceId are required' }
      });
    }

    const recommendationsResult = RecommendationService.getSlotRecommendations({
      officeId,
      serviceId,
      date,
      preferredWindow
    });

    res.json(recommendationsResult);
  }

  static getWaitTimePrediction(req, res) {
    const { officeId, serviceId, appointmentId, queuePosition } = req.query;

    if (!officeId || !serviceId) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'officeId and serviceId are required' }
      });
    }

    const prediction = PredictionService.calculateWaitTime({
      officeId,
      serviceId,
      appointmentId: appointmentId || null,
      queuePosition: queuePosition !== undefined ? parseInt(queuePosition, 10) : null
    });

    res.json({ prediction });
  }

  static getSlotRecommendations(req, res) {
    const { officeId, serviceId, date, preferredWindow } = req.query;

    if (!officeId || !serviceId) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'officeId and serviceId are required' }
      });
    }

    const recommendations = RecommendationService.getSlotRecommendations({
      officeId,
      serviceId,
      date,
      preferredWindow
    });

    res.json(recommendations);
  }

  static getNotifications(req, res) {
    const notifications = inMemoryDB.findAll('notifications', n => n.user_id === req.user.id);
    notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    res.json({ notifications });
  }

  static markNotificationRead(req, res) {
    const { id } = req.params;
    const notif = inMemoryDB.findById('notifications', id);
    if (!notif || notif.user_id !== req.user.id) {
      return res.status(404).json({
        error: { code: 'NOT_FOUND', message: 'Notification not found' }
      });
    }

    const updated = inMemoryDB.update('notifications', id, { is_read: true });
    res.json({ notification: updated });
  }
}
