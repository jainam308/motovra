import { Request, Response, NextFunction } from 'express';
import { analyticsService } from './analytics.service';

export const analyticsController = {
  async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await analyticsService.getDashboardStats();
      res.json(stats);
    } catch (err) {
      next(err);
    }
  },

  async getAnalyticsReports(req: Request, res: Response, next: NextFunction) {
    try {
      const reports = await analyticsService.getAnalyticsReports();
      res.json(reports);
    } catch (err) {
      next(err);
    }
  },

  async getRecentActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const activity = await analyticsService.getRecentActivity();
      res.json(activity);
    } catch (err) {
      next(err);
    }
  },
};
