import { Request, Response, NextFunction } from 'express';

export const vehicleController = {
  async create(req: Request, res: Response, next: NextFunction) {
    res.status(501).json({ error: 'Not implemented' });
  }
};
