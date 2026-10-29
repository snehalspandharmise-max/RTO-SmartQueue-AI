import { Router } from 'express';
import { AdminController } from '../controllers/adminController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = Router();

// Strict RBAC: All administrative endpoints require verified admin role on the server
router.use(authenticateToken, requireAdmin);

router.get('/dashboard', AdminController.getDashboard);
router.get('/appointments', AdminController.getAppointments);
router.patch('/appointments/:id/status', AdminController.updateAppointmentStatus);
router.get('/counters', AdminController.getCounters);
router.patch('/counters/:id', AdminController.updateCounter);
router.get('/recommendations', AdminController.getRecommendations);
router.post('/recommendations/:id/approve', AdminController.approveRecommendation);
router.post('/recommendations/:id/reject', AdminController.rejectRecommendation);
router.get('/analytics', AdminController.getAnalytics);
router.post('/analytics/seed-demo', AdminController.seedSyntheticDemoData);
router.get('/audit-logs', AdminController.getAuditLogs);
router.post('/reset-database', AdminController.resetDatabase);

export default router;
