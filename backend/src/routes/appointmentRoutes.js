import { Router } from 'express';
import { AppointmentController } from '../controllers/appointmentController.js';
import { authenticateToken, requireAuth } from '../middleware/auth.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.use(authenticateToken, requireAuth);

router.get('/my', AppointmentController.getMyAppointments);
router.post('/', rateLimiter({ max: 30 }), AppointmentController.bookAppointment);
router.get('/:id', AppointmentController.getAppointmentById);
router.patch('/:id/checkin', AppointmentController.checkIn);
router.patch('/:id/reschedule', AppointmentController.reschedule);
router.patch('/:id/cancel', AppointmentController.cancel);

export default router;
