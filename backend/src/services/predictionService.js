import { inMemoryDB } from '../config/db.js';

/**
 * Predictive Wait-Time Engine
 * Transparent, explainable mathematical queue model for RTO operations.
 */
export class PredictionService {
  /**
   * Calculate effective service duration by blending configured baseline with observed historical mean
   */
  static getEffectiveServiceDuration(serviceId) {
    const service = inMemoryDB.findById('services', serviceId);
    if (!service) {
      throw new Error(`Service with ID ${serviceId} not found`);
    }

    const baselineMinutes = service.estimated_duration_minutes || 15;

    // Fetch completed appointments for this service to calculate sample statistics
    const completedAppts = inMemoryDB.findAll('appointments', a => 
      a.service_id === serviceId && 
      a.status === 'completed' && 
      typeof a.actual_service_minutes === 'number' &&
      a.actual_service_minutes > 0
    );

    const sampleCount = completedAppts.length;

    if (sampleCount === 0) {
      return {
        effectiveMinutes: baselineMinutes,
        baselineMinutes,
        observedMeanMinutes: null,
        sampleCount: 0,
        credibilityFactorAlpha: 0,
        dataBasis: 'Configured Baseline (No Historical Observations)'
      };
    }

    const sumMinutes = completedAppts.reduce((sum, a) => sum + a.actual_service_minutes, 0);
    const observedMeanMinutes = parseFloat((sumMinutes / sampleCount).toFixed(2));

    // Empirical credibility weight alpha: scales with sample size up to 75% max
    const alpha = Math.min(0.75, parseFloat((sampleCount / 20).toFixed(2)));
    const effectiveMinutes = parseFloat((alpha * observedMeanMinutes + (1 - alpha) * baselineMinutes).toFixed(2));

    return {
      effectiveMinutes,
      baselineMinutes,
      observedMeanMinutes,
      sampleCount,
      credibilityFactorAlpha: alpha,
      dataBasis: `Weighted Blend: ${(alpha * 100).toFixed(0)}% Observed History (${sampleCount} records) + ${((1 - alpha) * 100).toFixed(0)}% Configured Prior`
    };
  }

  /**
   * Calculate predicted wait time for an appointment or prospective queue position
   */
  static calculateWaitTime({ officeId, serviceId, appointmentId = null, queuePosition = null }) {
    const service = inMemoryDB.findById('services', serviceId);
    if (!service) {
      throw new Error(`Service ${serviceId} not found`);
    }

    const durationInfo = this.getEffectiveServiceDuration(serviceId);
    const effectiveDuration = durationInfo.effectiveMinutes;

    // Find all active counters authorized to handle this service
    const authorizedCounterServices = inMemoryDB.findAll('counter_services', cs => cs.service_id === serviceId);
    const authorizedCounterIds = new Set(authorizedCounterServices.map(cs => cs.counter_id));

    const activeCounters = inMemoryDB.findAll('counters', c => 
      c.office_id === officeId && 
      c.status === 'active' && 
      authorizedCounterIds.has(c.id)
    );

    const activeCounterCount = Math.max(1, activeCounters.length);

    // Determine how many citizens are ahead in queue
    let queueAhead = 0;
    if (queuePosition !== null) {
      queueAhead = Math.max(0, queuePosition);
    } else if (appointmentId) {
      const targetAppt = inMemoryDB.findById('appointments', appointmentId);
      if (targetAppt) {
        if (targetAppt.status === 'in_progress') {
          return {
            estimatedWaitMinutes: 0,
            lowerBoundMinutes: 0,
            upperBoundMinutes: 2,
            confidenceScore: 0.99,
            confidenceLabel: 'Now Serving',
            calculationTimestamp: new Date().toISOString(),
            factorsUsed: { status: 'in_progress', queueAhead: 0 },
            explanation: 'Your token is currently called at the counter.',
            dataBasis: 'Real-time Counter Dispatch'
          };
        }

        if (targetAppt.status === 'completed' || targetAppt.status === 'cancelled' || targetAppt.status === 'no_show') {
          return {
            estimatedWaitMinutes: 0,
            lowerBoundMinutes: 0,
            upperBoundMinutes: 0,
            confidenceScore: 1.0,
            confidenceLabel: 'Concluded',
            calculationTimestamp: new Date().toISOString(),
            factorsUsed: { status: targetAppt.status },
            explanation: `Appointment is already marked as ${targetAppt.status}.`,
            dataBasis: 'Terminal State'
          };
        }

        // Count eligible waiting citizens ahead in line (checked in earlier or smaller token number)
        const waitingAhead = inMemoryDB.findAll('appointments', a => 
          a.office_id === officeId &&
          a.service_id === serviceId &&
          (a.status === 'waiting' || a.status === 'checked_in') &&
          a.token_date === targetAppt.token_date &&
          a.token_number < targetAppt.token_number
        );
        queueAhead = waitingAhead.length;
      }
    }

    // 1. Residual time of customers currently being served
    const inProgressAppts = inMemoryDB.findAll('appointments', a => 
      a.office_id === officeId && 
      a.service_id === serviceId && 
      a.status === 'in_progress'
    );

    let residualMinutes = 0;
    const now = Date.now();
    inProgressAppts.forEach(a => {
      const startTime = a.service_started_at ? new Date(a.service_started_at).getTime() : now;
      const elapsedMinutes = Math.max(0, (now - startTime) / 60000);
      const remaining = Math.max(2, effectiveDuration - elapsedMinutes);
      residualMinutes += remaining;
    });

    // 2. Backlog time of customers ahead in queue
    const backlogMinutes = queueAhead * effectiveDuration;

    // 3. Multi-counter distribution with congestion damping factor
    const rawWorkload = residualMinutes + backlogMinutes;
    const congestionDamping = 1.0 + 0.02 * Math.min(10, queueAhead);
    
    let estimatedWaitMinutes = 0;
    if (queueAhead > 0 || residualMinutes > 0) {
      estimatedWaitMinutes = Math.round((rawWorkload / activeCounterCount) * congestionDamping);
      estimatedWaitMinutes = Math.max(3, estimatedWaitMinutes);
    }

    // 4. Uncertainty margin and bounds
    let margin = 0.35; // Default for low sample
    let confidenceLabel = 'Moderate';
    let confidenceScore = 0.70;

    if (durationInfo.sampleCount >= 20) {
      margin = 0.15;
      confidenceLabel = 'High';
      confidenceScore = 0.90;
    } else if (durationInfo.sampleCount >= 5) {
      margin = 0.25;
      confidenceLabel = 'Moderate';
      confidenceScore = 0.80;
    } else {
      margin = 0.35;
      confidenceLabel = 'Baseline Prior';
      confidenceScore = 0.65;
    }

    const lowerBoundMinutes = Math.max(1, Math.round(estimatedWaitMinutes * (1 - margin)));
    const upperBoundMinutes = Math.max(lowerBoundMinutes + 2, Math.round(estimatedWaitMinutes * (1 + margin) + 1));

    let explanation = '';
    if (queueAhead === 0) {
      explanation = `Next in queue. Estimated wait is approximately ${estimatedWaitMinutes} minutes across ${activeCounterCount} active counter(s).`;
    } else {
      explanation = `Based on ${queueAhead} citizen(s) ahead distributed across ${activeCounterCount} active counter(s) handling ${service.name}, with an effective service duration of ${effectiveDuration} minutes.`;
    }

    return {
      estimatedWaitMinutes,
      lowerBoundMinutes,
      upperBoundMinutes,
      confidenceScore,
      confidenceLabel,
      calculationTimestamp: new Date().toISOString(),
      factorsUsed: {
        queueAhead,
        activeAuthorizedCounters: activeCounterCount,
        effectiveDurationMinutes: effectiveDuration,
        baselineConfiguredMinutes: durationInfo.baselineMinutes,
        observedHistoricalMeanMinutes: durationInfo.observedMeanMinutes,
        sampleCount: durationInfo.sampleCount,
        congestionDampingMultiplier: parseFloat(congestionDamping.toFixed(2))
      },
      explanation,
      dataBasis: durationInfo.dataBasis
    };
  }

  /**
   * Save a snapshot of the prediction for audit and accuracy tracking
   */
  static recordSnapshot(appointmentId, prediction) {
    const appt = inMemoryDB.findById('appointments', appointmentId);
    if (!appt) return null;

    const snapshot = inMemoryDB.insert('prediction_snapshots', {
      appointment_id: appointmentId,
      office_id: appt.office_id,
      service_id: appt.service_id,
      predicted_wait_minutes: prediction.estimatedWaitMinutes,
      lower_bound_minutes: prediction.lowerBoundMinutes,
      upper_bound_minutes: prediction.upperBoundMinutes,
      confidence_score: prediction.confidenceScore,
      confidence_label: prediction.confidenceLabel,
      factors_used: prediction.factorsUsed,
      data_basis: prediction.dataBasis
    });

    return snapshot;
  }
}
