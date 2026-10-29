import { Router } from 'express';
import { QueueController } from '../controllers/queueController.js';
import { authenticateToken, requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(authenticateToken, requireAuth);

router.get('/my', QueueController.getMyQueue);
router.get('/:appointmentId', QueueController.getQueueByAppointmentId);

export default router;
