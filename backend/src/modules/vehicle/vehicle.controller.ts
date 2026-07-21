import { Request, Response, NextFunction } from 'express';
import { vehicleService } from './vehicle.service';

export const vehicleController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicle = await vehicleService.create(req.body);
      res.status(201).json(vehicle);
    } catch (error) {
      next(error);
    }
  }
};
