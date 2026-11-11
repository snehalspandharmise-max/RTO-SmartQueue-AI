
import { supabase, inMemoryDB } from '../config/db.js';
import { PredictionService } from '../services/predictionService.js';
import { RecommendationService } from '../services/recommendationService.js';
import { MAHARASHTRA_REGIONS } from '../data/maharashtraOffices.js';
import {
  ANNOUNCEMENTS,
  ROAD_SIGNS,
  LL_QUESTIONS,
  INITIAL_LEADERBOARD
} from '../data/portalData.js';

export class ResourceController {

  // GET ALL RTO OFFICES FROM SUPABASE
  static async getOffices(req, res) {
    try {
      const { search, region, hasLiveQueue } = req.query;

      const { data, error } = await supabase
        .from('rto_offices')
        .select('*')
        .eq('is_active', true)
        .order('office_code', { ascending: true });

      if (error) throw error;

      let offices = data || [];

      if (region && region !== 'All Regions') {
        offices = offices.filter(o => o.region === region);
      }

      if (hasLiveQueue === 'true') {
        offices = offices.filter(o => o.has_live_queue_integration === true);
      }

      if (search?.trim()) {
        const q = search.trim().toLowerCase();

        offices = offices.filter(o =>
          o.office_code?.toLowerCase().includes(q) ||
          o.office_name?.toLowerCase().includes(q) ||
          o.city?.toLowerCase().includes(q) ||
          o.district?.toLowerCase().includes(q) ||
          o.address?.toLowerCase().includes(q) ||
          o.region?.toLowerCase().includes(q)
        );
      }

      res.json({
        total: offices.length,
        offices,
        regions: MAHARASHTRA_REGIONS,
        disclaimer: 'Independent academic project. Not an official government website.'
      });
    } catch (error) {
      console.error('Supabase office directory error:', error);
      res.status(500).json({
        error: {
          code: 'OFFICE_FETCH_FAILED',
          message: 'Unable to load RTO offices from the database.'
        }
      });
    }
  }

  // GET ACTIVE SERVICES
  static async getServices(req, res) {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      res.json({ services: data || [] });
    } catch (error) {
      console.error('Services fetch error:', error);
      res.status(500).json({
        error: {
          code: 'SERVICES_FETCH_FAILED',
          message: 'Unable to load RTO services.'
        }
      });
    }
  }

  // GET SERVICES AVAILABLE AT AN OFFICE
  static async getOfficeServices(req, res) {
    try {
      const { officeId } = req.params;

      const { data, error } = await supabase
        .from('office_services')
        .select('service_id, services(*)')
        .eq('office_id', officeId);

      if (error) throw error;

      const services = (data || [])
        .map(item => item.services)
        .filter(service => service?.is_active);

      res.json({ services, officeId });
    } catch (error) {
      console.error('Office services fetch error:', error);
      res.status(500).json({
        error: {
          code: 'OFFICE_SERVICES_FETCH_FAILED',
          message: 'Unable to load services for this RTO office.'
        }
      });
    }
  }

  // GET REAL APPOINTMENT SLOTS FROM SUPABASE
  static async getSlots(req, res) {
    try {
      const { officeId, serviceId, date } = req.query;

      if (!officeId || !serviceId) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'officeId and serviceId are required.'
          }
        });
      }

      let query = supabase
        .from('appointment_slots')
        .select('*')
        .eq('office_id', officeId)
        .eq('service_id', serviceId)
        .eq('is_active', true)
        .order('slot_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (date) {
        query = query.eq('slot_date', date);
      } else {
        const today = new Intl.DateTimeFormat('en-CA', {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).format(new Date());

        query = query.gte('slot_date', today);
      }

      const { data: slots, error } = await query;

      if (error) throw error;

      const availableSlots = (slots || []).map(slot => {
        const remainingCapacity = Math.max(
          0,
          slot.max_capacity - slot.booked_count
        );

        return {
          ...slot,
          remainingCapacity,
          remaining_capacity: remainingCapacity,
          isFull: remainingCapacity <= 0,
          available: remainingCapacity > 0
        };
      });

      res.json({
        date: date || null,
        total: availableSlots.length,
        availableCount: availableSlots.filter(s => s.available).length,
        slots: availableSlots,
        message: availableSlots.length
          ? 'Appointment slots loaded from Supabase.'
          : 'No appointment slots are currently available for the selected date.'
      });
    } catch (error) {
      console.error('Supabase appointment slots error:', error);

      res.status(500).json({
        error: {
          code: 'SLOTS_FETCH_FAILED',
          message: 'Unable to load appointment slots from the database.'
        }
      });
    }
  }

  // GET WAIT-TIME PREDICTION (EXISTING ENGINE)
  static getWaitTimePrediction(req, res) {
    const {
      officeId,
      serviceId,
      appointmentId,
      queuePosition
    } = req.query;

    if (!officeId || !serviceId) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'officeId and serviceId are required.'
        }
      });
    }

    const prediction = PredictionService.calculateWaitTime({
      officeId,
      serviceId,
      appointmentId: appointmentId || null,
      queuePosition: queuePosition !== undefined
        ? parseInt(queuePosition, 10)
        : null
    });

    res.json({ prediction });
  }

  // GET SLOT RECOMMENDATIONS (EXISTING ENGINE)
  static getSlotRecommendations(req, res) {
    const {
      officeId,
      serviceId,
      date,
      preferredWindow
    } = req.query;

    if (!officeId || !serviceId) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'officeId and serviceId are required.'
        }
      });
    }

    const recommendations =
      RecommendationService.getSlotRecommendations({
        officeId,
        serviceId,
        date,
        preferredWindow
      });

    res.json(recommendations);
  }

  // GET USER NOTIFICATIONS
  static async getNotifications(req, res) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', req.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      res.json({ notifications: data || [] });
    } catch (error) {
      console.error('Notifications fetch error:', error);
      res.status(500).json({
        error: {
          code: 'NOTIFICATIONS_FETCH_FAILED',
          message: 'Unable to load notifications.'
        }
      });
    }
  }

  // MARK NOTIFICATION AS READ
  static async markNotificationRead(req, res) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', req.params.id)
        .eq('user_id', req.user.id)
        .select('*')
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: 'Notification not found.'
          }
        });
      }

      res.json({ notification: data });
    } catch (error) {
      console.error('Notification update error:', error);
      res.status(500).json({
        error: {
          code: 'NOTIFICATION_UPDATE_FAILED',
          message: 'Unable to update notification.'
        }
      });
    }
  }

  // GET ANNOUNCEMENTS
  static getAnnouncements(req, res) {
    res.json({ announcements: ANNOUNCEMENTS });
  }

  // GET ROAD SIGNS
  static getRoadSigns(req, res) {
    const { category } = req.query;
    let signs = ROAD_SIGNS;

    if (category && category !== 'all') {
      signs = signs.filter(
        sign => sign.category.toLowerCase() === category.toLowerCase()
      );
    }

    res.json({ signs });
  }

  // GET ROAD SAFETY QUESTIONS
  static getRoadSafetyQuestions(req, res) {
    res.json({ questions: LL_QUESTIONS });
  }

  // GET ROAD SAFETY LEADERBOARD
  static getLeaderboard(req, res) {
    res.json({ leaderboard: INITIAL_LEADERBOARD });
  }

  // SUBMIT FEEDBACK
  static submitFeedback(req, res) {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Name, email, and message are required.'
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Feedback received successfully.',
      feedback: {
        id: `fb-${Date.now()}`,
        name,
        email,
        phone: phone || null,
        subject: subject || 'General Feedback',
        message,
        created_at: new Date().toISOString()
      }
    });
  }
}
