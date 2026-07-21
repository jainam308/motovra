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
  },

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await vehicleService.list(req.query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};
