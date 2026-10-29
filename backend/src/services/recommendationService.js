import { inMemoryDB } from '../config/db.js';
import { PredictionService } from './predictionService.js';

/**
 * Smart Slot Recommendation Engine
 * Analyzes slot capacity, projected demand, and wait-time estimations to recommend optimal appointment times.
 */
export class RecommendationService {
  /**
   * Recommend the top 3 slot alternatives: Lowest Wait, Balanced, and Most Convenient
   */
  static getSlotRecommendations({ officeId, serviceId, date, preferredWindow = null }) {
    const service = inMemoryDB.findById('services', serviceId);
    if (!service) {
      throw new Error(`Service ${serviceId} not found`);
    }

    const targetDate = date || new Date().toISOString().split('T')[0];

    // Find all slots for this office, service, and date
    let slots = inMemoryDB.findAll('appointment_slots', s => 
      s.office_id === officeId && 
      s.service_id === serviceId && 
      s.slot_date === targetDate &&
      s.is_active
    );

    // If no slots exist for future date, generate demonstration slots
    if (slots.length === 0) {
      const times = [
        { start: '09:00:00', end: '10:00:00', booked: 3 },
        { start: '10:00:00', end: '11:00:00', booked: 5 },
        { start: '11:00:00', end: '12:00:00', booked: 2 },
        { start: '14:00:00', end: '15:00:00', booked: 1 },
        { start: '15:00:00', end: '16:00:00', booked: 0 }
      ];

      times.forEach(t => {
        const newSlot = inMemoryDB.insert('appointment_slots', {
          office_id: officeId,
          service_id: serviceId,
          slot_date: targetDate,
          start_time: t.start,
          end_time: t.end,
          max_capacity: service.appointment_quota_per_slot || 6,
          booked_count: t.booked,
          is_active: true
        });
        slots.push(newSlot);
      });
    }

    // Evaluate each slot
    const scoredSlots = slots.map(slot => {
      const remainingCapacity = Math.max(0, slot.max_capacity - slot.booked_count);
      const isFull = remainingCapacity <= 0;
      const capacityRatio = slot.max_capacity > 0 ? (remainingCapacity / slot.max_capacity) : 0;

      // Estimate wait time based on booked count ahead in that slot
      const waitPred = PredictionService.calculateWaitTime({
        officeId,
        serviceId,
        queuePosition: slot.booked_count
      });

      // Composite balanced score: balances lower wait with higher available headroom
      const waitPenalty = Math.min(1.0, waitPred.estimatedWaitMinutes / 60);
      const balancedScore = parseFloat((0.6 * (1 - waitPenalty) + 0.4 * capacityRatio).toFixed(3));

      const hour = parseInt(slot.start_time.split(':')[0], 10);
      const isMorning = hour >= 9 && hour < 13;
      const isAfternoon = hour >= 13 && hour <= 17;

      return {
        slotId: slot.id,
        startTime: slot.start_time,
        endTime: slot.end_time,
        maxCapacity: slot.max_capacity,
        bookedCount: slot.booked_count,
        remainingCapacity,
        isFull,
        capacityRatio: parseFloat(capacityRatio.toFixed(2)),
        predictedWaitMinutes: waitPred.estimatedWaitMinutes,
        lowerBoundMinutes: waitPred.lowerBoundMinutes,
        upperBoundMinutes: waitPred.upperBoundMinutes,
        confidenceLabel: waitPred.confidenceLabel,
        balancedScore,
        isMorning,
        isAfternoon
      };
    });

    const availableSlots = scoredSlots.filter(s => !s.isFull);

    if (availableSlots.length === 0) {
      return {
        date: targetDate,
        allSlots: scoredSlots,
        recommendations: null,
        message: 'All appointment slots for the selected date are fully booked.'
      };
    }

    // 1. Lowest Predicted Wait Option
    const lowestWaitSlot = [...availableSlots].sort((a, b) => a.predictedWaitMinutes - b.predictedWaitMinutes)[0];

    // 2. Balanced Option (Highest Composite Score)
    const balancedSlot = [...availableSlots].sort((a, b) => b.balancedScore - a.balancedScore)[0];

    // 3. Most Convenient Option
    let convenientSlot = null;
    if (preferredWindow === 'afternoon') {
      convenientSlot = availableSlots.find(s => s.isAfternoon) || availableSlots[0];
    } else if (preferredWindow === 'morning') {
      convenientSlot = availableSlots.find(s => s.isMorning) || availableSlots[0];
    } else {
      // Default: earliest available morning slot
      convenientSlot = availableSlots.find(s => s.isMorning) || availableSlots[0];
    }

    return {
      date: targetDate,
      serviceName: service.name,
      allSlots: scoredSlots,
      recommendations: {
        lowestWait: {
          slot: lowestWaitSlot,
          badge: 'Fastest Service',
          reason: `Minimal queue delay. Expected wait time of approximately ${lowestWaitSlot.predictedWaitMinutes} min with ${lowestWaitSlot.remainingCapacity} seats left.`
        },
        balanced: {
          slot: balancedSlot,
          badge: 'Recommended',
          reason: `Best trade-off between low wait time (${balancedSlot.predictedWaitMinutes} min) and ample remaining capacity (${balancedSlot.remainingCapacity}/${balancedSlot.maxCapacity}).`
        },
        mostConvenient: {
          slot: convenientSlot,
          badge: preferredWindow ? `Preferred (${preferredWindow})` : 'Popular Time',
          reason: `Convenient ${convenientSlot.isMorning ? 'morning' : 'afternoon'} slot starting at ${convenientSlot.startTime.substring(0, 5)} with ${convenientSlot.remainingCapacity} available seats.`
        }
      }
    };
  }
}
