import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const tokens = await authService.login(email, password);
      res.status(200).json(tokens);
    } catch (error) {
      next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(501).json({ error: 'Not implemented' });
    } catch (error) {
      next(error);
    }
  }
};
