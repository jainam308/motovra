import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../errors/ForbiddenError';

export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || user.role !== role) {
      return next(new ForbiddenError('Access denied'));
    }
    next();
  };
};
