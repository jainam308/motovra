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
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicle = await vehicleService.update(req.params.id, req.body);
      res.status(200).json(vehicle);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await vehicleService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  async purchase(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicle = await vehicleService.purchase(req.params.id);
      res.status(200).json(vehicle);
    } catch (error) {
      next(error);
    }
  },

  async restock(req: Request, res: Response, next: NextFunction) {
    try {
      const vehicle = await vehicleService.restock(req.params.id, req.body.amount);
      res.status(200).json(vehicle);
    } catch (error) {
      next(error);
    }
  }
};
