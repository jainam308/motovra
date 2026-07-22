import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const savedVehicleController = {
  async toggleSave(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params; // vehicle id
      const userId = (req as any).user.userId;

      const vehicle = await prisma.vehicle.findUnique({ where: { id } });
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      const existing = await prisma.savedVehicle.findUnique({
        where: {
          userId_vehicleId: {
            userId,
            vehicleId: id
          }
        }
      });

      if (existing) {
        await prisma.savedVehicle.delete({
          where: { id: existing.id }
        });
        return res.status(200).json({ message: 'Removed from garage', saved: false });
      } else {
        await prisma.savedVehicle.create({
          data: {
            userId,
            vehicleId: id
          }
        });
        return res.status(200).json({ message: 'Added to garage', saved: true });
      }
    } catch (error) {
      next(error);
    }
  },

  async getSavedVehicles(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user.userId;
      const saved = await prisma.savedVehicle.findMany({
        where: { userId },
        include: { vehicle: true },
        orderBy: { createdAt: 'desc' }
      });
      
      return res.status(200).json(saved);
    } catch (error) {
      next(error);
    }
  }
};
