import { inMemoryDB } from '../config/db.js';
import { PredictionService } from './predictionService.js';

/**
 * Adaptive Counter Workload Optimization Service
 * Identifies congestion bottlenecks and recommends certified counter load-sharing.
 */
export class WorkloadService {
  /**
   * Scan office counters and generate dynamic load-balancing recommendations
   */
  static generateWorkloadRecommendations(officeId) {
    const counters = inMemoryDB.findAll('counters', c => c.office_id === officeId);
    const services = inMemoryDB.findAll('services', s => s.is_active);
    const counterServices = inMemoryDB.findAll('counter_services');

    const recommendations = [];

    counters.forEach(counter => {
      // Find services supported by this counter
      const supportedServiceIds = counterServices
        .filter(cs => cs.counter_id === counter.id)
        .map(cs => cs.service_id);

      supportedServiceIds.forEach(serviceId => {
        const service = services.find(s => s.id === serviceId);
        if (!service) return;

        // Waiting appointments for this service
        const waitingAppts = inMemoryDB.findAll('appointments', a => 
          a.office_id === officeId && 
          a.service_id === serviceId && 
          (a.status === 'waiting' || a.status === 'checked_in')
        );

        const queueLength = waitingAppts.length;
        const waitPred = PredictionService.calculateWaitTime({
          officeId,
          serviceId,
          queuePosition: queueLength
        });

        // Congestion condition: queue > 3 or estimated wait > 30 min
        const isCongested = queueLength >= 3 || waitPred.estimatedWaitMinutes >= 30;

        if (isCongested) {
          // Look for an active underutilized counter eligible for this service
          const underutilizedCounters = counters.filter(c => {
            if (c.id === counter.id || c.status !== 'active') return false;
            // Check if target counter is already authorized for this service
            const isAuthorized = counterServices.some(cs => cs.counter_id === c.id && cs.service_id === serviceId);
            return isAuthorized;
          });

          if (underutilizedCounters.length > 0) {
            const targetCounter = underutilizedCounters[0];
            const existingPending = inMemoryDB.findOne('counter_recommendations', r => 
              r.source_counter_id === counter.id && 
              r.target_counter_id === targetCounter.id &&
              r.service_id === serviceId &&
              r.status === 'pending'
            );

            if (!existingPending) {
              const expectedReduction = Math.round(waitPred.estimatedWaitMinutes * 0.4);
              const rec = inMemoryDB.insert('counter_recommendations', {
                office_id: officeId,
                service_id: serviceId,
                source_counter_id: counter.id,
                target_counter_id: targetCounter.id,
                recommendation_type: 'REASSIGN_COUNTER',
                rationale: `${counter.counter_label} has ${queueLength} citizens waiting for ${service.name} (est. wait: ${waitPred.estimatedWaitMinutes} min). Eligible ${targetCounter.counter_label} has available capacity. Dynamic load sharing will reduce wait times by approximately ${expectedReduction} minutes.`,
                expected_wait_reduction_minutes: expectedReduction,
                status: 'pending',
                reviewed_by: null,
                reviewed_at: null
              });
              recommendations.push(rec);
            }
          }
        }
      });
    });

    return recommendations;
  }

  /**
   * Approve a workload recommendation transactionally
   */
  static approveRecommendation(recommendationId, adminUser) {
    const rec = inMemoryDB.findById('counter_recommendations', recommendationId);
    if (!rec) {
      throw new Error(`Recommendation ${recommendationId} not found`);
    }

    if (rec.status !== 'pending') {
      throw new Error(`Recommendation has already been ${rec.status}`);
    }

    // 1. Transactional check & update: Ensure target counter is certified
    const existingMapping = inMemoryDB.findOne('counter_services', cs => 
      cs.counter_id === rec.target_counter_id && cs.service_id === rec.service_id
    );

    if (!existingMapping) {
      inMemoryDB.insert('counter_services', {
        counter_id: rec.target_counter_id,
        service_id: rec.service_id
      });
    }

    // 2. Update recommendation status
    const updatedRec = inMemoryDB.update('counter_recommendations', recommendationId, {
      status: 'approved',
      reviewed_by: adminUser.id,
      reviewed_at: new Date().toISOString()
    });

    // 3. Log into immutable audit log
    inMemoryDB.insert('audit_logs', {
      actor_id: adminUser.id,
      action: 'APPROVE_COUNTER_REASSIGNMENT',
      target_type: 'counter_recommendation',
      target_id: recommendationId,
      change_summary: {
        sourceCounterId: rec.source_counter_id,
        targetCounterId: rec.target_counter_id,
        serviceId: rec.service_id,
        expectedReductionMinutes: rec.expected_wait_reduction_minutes,
        adminEmail: adminUser.email
      },
      ip_address: '127.0.0.1'
    });

    return updatedRec;
  }

  /**
   * Reject a workload recommendation
   */
  static rejectRecommendation(recommendationId, adminUser) {
    const rec = inMemoryDB.findById('counter_recommendations', recommendationId);
    if (!rec) {
      throw new Error(`Recommendation ${recommendationId} not found`);
    }

    if (rec.status !== 'pending') {
      throw new Error(`Recommendation has already been ${rec.status}`);
    }

    const updatedRec = inMemoryDB.update('counter_recommendations', recommendationId, {
      status: 'rejected',
      reviewed_by: adminUser.id,
      reviewed_at: new Date().toISOString()
    });

    inMemoryDB.insert('audit_logs', {
      actor_id: adminUser.id,
      action: 'REJECT_COUNTER_REASSIGNMENT',
      target_type: 'counter_recommendation',
      target_id: recommendationId,
      change_summary: {
        recommendationId,
        adminEmail: adminUser.email
      },
      ip_address: '127.0.0.1'
    });

    return updatedRec;
  }
}
