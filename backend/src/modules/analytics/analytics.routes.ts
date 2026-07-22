import { Router } from 'express';
import { analyticsController } from './analytics.controller';
import { requireAuth } from '../../common/middlewares/requireAuth';

const router = Router();

// Protect all analytics endpoints for authenticated users/admins
router.get('/stats', requireAuth, analyticsController.getDashboardStats);

export default router;
