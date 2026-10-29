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

// Notifications (Authenticated)
router.get('/notifications', authenticateToken, requireAuth, ResourceController.getNotifications);
router.patch('/notifications/:id/read', authenticateToken, requireAuth, ResourceController.markNotificationRead);

export default router;
