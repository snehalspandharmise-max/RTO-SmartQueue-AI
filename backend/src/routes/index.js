import { Router } from 'express';
import authRoutes from './authRoutes.js';
import resourceRoutes from './resourceRoutes.js';
import appointmentRoutes from './appointmentRoutes.js';
import queueRoutes from './queueRoutes.js';
import adminRoutes from './adminRoutes.js';

const apiRouter = Router();

apiRouter.use('/', authRoutes);
apiRouter.use('/', resourceRoutes);
apiRouter.use('/appointments', appointmentRoutes);
apiRouter.use('/queue', queueRoutes);
apiRouter.use('/admin', adminRoutes);

export default apiRouter;
