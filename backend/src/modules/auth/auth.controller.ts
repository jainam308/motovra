import { Request, Response, NextFunction } from 'express';

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(501).json({ error: 'Not implemented' });
    } catch (error) {
      next(error);
    }
  }
};
