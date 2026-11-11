import { Router } from 'express';
import { ResourceController } from '../controllers/resourceController.js';
import { authenticateToken, requireAuth } from '../middleware/auth.js';

const router = Router();

// Public / Citizen resources
router.get('/offices', ResourceController.getOffices);
router.get('/services', ResourceController.getServices);
router.get('/offices/:officeId/services', ResourceController.getOfficeServices);
router.get('/slots', ResourceController.getSlots);
router.get('/predictions/wait-time', ResourceController.getWaitTimePrediction);
router.get('/predictions/recommendations', ResourceController.getSlotRecommendations);

// Portal Data & Road Safety Learning Centre
router.get('/announcements', ResourceController.getAnnouncements);
router.get('/road-safety/signs', ResourceController.getRoadSigns);
router.get('/road-safety/questions', ResourceController.getRoadSafetyQuestions);
router.get('/road-safety/leaderboard', ResourceController.getLeaderboard);
router.post('/feedback', ResourceController.submitFeedback);

// Notifications (Authenticated)
router.get('/notifications', authenticateToken, requireAuth, ResourceController.getNotifications);
router.patch('/notifications/:id/read', authenticateToken, requireAuth, ResourceController.markNotificationRead);

export default router;
