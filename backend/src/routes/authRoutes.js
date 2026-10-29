import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { authenticateToken, requireAuth } from '../middleware/auth.js';
import { rateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.get('/health', AuthController.getHealth);
router.post('/auth/register', rateLimiter({ max: 20 }), AuthController.register);
router.post('/auth/login', rateLimiter({ max: 30 }), AuthController.login);
router.get('/me', authenticateToken, requireAuth, AuthController.getMe);

export default router;
