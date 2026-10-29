import { inMemoryDB } from '../config/db.js';
import { AnalyticsService } from '../services/analyticsService.js';
import { QueueService } from '../services/queueService.js';
import { WorkloadService } from '../services/workloadService.js';
import { AppointmentService } from '../services/appointmentService.js';

export class AdminController {
  static getDashboard(req, res, next) {
    try {
      const officeId = req.query.officeId || null;
      const stats = AnalyticsService.getDashboardStats(officeId);
      res.json({ stats });
    } catch (err) {
      next(err);
    }
  }

  static getAppointments(req, res, next) {
    try {
      const { status, officeId, serviceId, search, date } = req.query;

      let list = inMemoryDB.findAll('appointments', a => {
        if (status && a.status !== status) return false;
        if (officeId && a.office_id !== officeId) return false;
        if (serviceId && a.service_id !== serviceId) return false;
        if (date && a.token_date !== date) return false;
        if (search) {
          const s = search.toLowerCase();
          const matchRef = a.booking_reference?.toLowerCase().includes(s);
          const matchToken = a.queue_token?.toLowerCase().includes(s);
          if (!matchRef && !matchToken) return false;
        }
        return true;
      });

      // Sort: today's waiting/in_progress first, then newest
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      const hydrated = list.map(a => AppointmentService.hydrateAppointment(a));
      res.json({
        total: hydrated.length,
        appointments: hydrated
      });
    } catch (err) {
      next(err);
    }
  }

  static updateAppointmentStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status, counter_id, notes } = req.body;

      if (!status) {
        return res.status(400).json({
          error: { code: 'VALIDATION_ERROR', message: 'status is required' }
        });
      }

      const updated = QueueService.advanceStatus(id, status, req.user, {
        counterId: counter_id,
        notes
      });

      res.json({
        message: `Appointment updated to '${status}' successfully`,
        appointment: updated
      });
    } catch (err) {
      next(err);
    }
  }

  static getCounters(req, res, next) {
    try {
      const officeId = req.query.officeId || null;
      const counters = inMemoryDB.findAll('counters', c => officeId ? c.office_id === officeId : true);
      const services = inMemoryDB.findAll('services');
      const counterServices = inMemoryDB.findAll('counter_services');

      const enriched = counters.map(counter => {
        const supported = counterServices
          .filter(cs => cs.counter_id === counter.id)
          .map(cs => services.find(s => s.id === cs.service_id))
          .filter(Boolean);

        const currentAppt = counter.current_appointment_id
          ? inMemoryDB.findById('appointments', counter.current_appointment_id)
          : null;

        // Waiting count for services supported by this counter
        const suppIds = new Set(supported.map(s => s.id));
        const waitingForCounter = inMemoryDB.findAll('appointments', a => 
          a.office_id === counter.office_id && 
          suppIds.has(a.service_id) && 
          (a.status === 'waiting' || a.status === 'checked_in')
        ).length;

        return {
          ...counter,
          supportedServices: supported,
          currentAppointment: currentAppt,
          waitingQueueCount: waitingForCounter
        };
      });

      res.json({ counters: enriched });
    } catch (err) {
      next(err);
    }
  }

  static updateCounter(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['active', 'busy', 'paused', 'offline'].includes(status)) {
        return res.status(400).json({
          error: { code: 'VALIDATION_ERROR', message: 'Invalid counter status' }
        });
      }

      const updated = inMemoryDB.update('counters', id, { status });
      if (!updated) {
        return res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Counter not found' }
        });
      }

      inMemoryDB.insert('audit_logs', {
        actor_id: req.user.id,
        action: 'UPDATE_COUNTER_STATUS',
        target_type: 'counter',
        target_id: id,
        change_summary: { newStatus: status, adminEmail: req.user.email },
        ip_address: '127.0.0.1'
      });

      res.json({
        message: 'Counter updated successfully',
        counter: updated
      });
    } catch (err) {
      next(err);
    }
  }

  static getRecommendations(req, res, next) {
    try {
      const officeId = req.query.officeId || inMemoryDB.findAll('rto_offices')[0]?.id;
      if (officeId) {
        WorkloadService.generateWorkloadRecommendations(officeId);
      }

      const recommendations = inMemoryDB.findAll('counter_recommendations');
      const counters = inMemoryDB.findAll('counters');
      const services = inMemoryDB.findAll('services');

      const enriched = recommendations.map(r => ({
        ...r,
        sourceCounter: counters.find(c => c.id === r.source_counter_id),
        targetCounter: counters.find(c => c.id === r.target_counter_id),
        service: services.find(s => s.id === r.service_id)
      }));

      // Sort pending first
      enriched.sort((a, b) => (a.status === 'pending' ? -1 : 1));

      res.json({ recommendations: enriched });
    } catch (err) {
      next(err);
    }
  }

  static approveRecommendation(req, res, next) {
    try {
      const updated = WorkloadService.approveRecommendation(req.params.id, req.user);
      res.json({
        message: 'Counter workload recommendation approved and executed.',
        recommendation: updated
      });
    } catch (err) {
      next(err);
    }
  }

  static rejectRecommendation(req, res, next) {
    try {
      const updated = WorkloadService.rejectRecommendation(req.params.id, req.user);
      res.json({
        message: 'Recommendation rejected.',
        recommendation: updated
      });
    } catch (err) {
      next(err);
    }
  }

  static getAnalytics(req, res, next) {
    try {
      const officeId = req.query.officeId || null;
      const chartData = AnalyticsService.getChartData(officeId);
      const predictionEvaluation = AnalyticsService.getPredictionEvaluation(officeId);

      res.json({
        chartData,
        predictionEvaluation
      });
    } catch (err) {
      next(err);
    }
  }

  static seedSyntheticDemoData(req, res, next) {
    try {
      const count = parseInt(req.body.count, 10) || 25;
      const result = AnalyticsService.seedSyntheticDemoData(count);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static getAuditLogs(req, res, next) {
    try {
      const logs = inMemoryDB.findAll('audit_logs');
      logs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      res.json({ auditLogs: logs });
    } catch (err) {
      next(err);
    }
  }

  static resetDatabase(req, res, next) {
    try {
      inMemoryDB.reset();
      res.json({
        success: true,
        message: 'Demonstration database successfully reset to clean seed state.'
      });
    } catch (err) {
      next(err);
    }
  }
}
