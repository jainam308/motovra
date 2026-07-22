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
};
