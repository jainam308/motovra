import { Router } from 'express';
import { analyticsController } from './analytics.controller';
import { requireAuth } from '../../common/middlewares/requireAuth';

const router = Router();

// Protect all analytics endpoints
router.get('/stats', requireAuth, analyticsController.getDashboardStats);
router.get('/reports', requireAuth, analyticsController.getAnalyticsReports);
router.get('/recent-activity', requireAuth, analyticsController.getRecentActivity);

export default router;
