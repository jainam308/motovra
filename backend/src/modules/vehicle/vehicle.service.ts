import { PrismaClient } from '@prisma/client';
import { vehicleValidation } from './vehicle.validation';
import { orderService } from '../order/order.service';
import { generateAndStoreMarketAnalysis } from '../../services/aiMarketAnalysis.service';

const prisma = new PrismaClient();

export const vehicleService = {
  async create(data: any): Promise<any> {
    const { error, value } = vehicleValidation.create.validate(data);
    if (error) {
      const err: any = new Error(error.details[0].message);
      err.statusCode = 400;
      throw err;
    }

    const created = await prisma.vehicle.create({
      data: value
    });

    // Auto-generate AI Market Intelligence Baseline
    try {
      return await generateAndStoreMarketAnalysis(created.id);
    } catch (e) {
      console.error('[VehicleService] Warning: Failed to auto-generate AI analysis on create:', e);
      return created;
    }
  },

  async list(query: any): Promise<any> {
    const { error, value } = vehicleValidation.search.validate(query);
    if (error) {
      const err: any = new Error(error.message);
      err.statusCode = 400;
      throw err;
    }

    const { page, limit, make, model, category, minPrice, maxPrice } = value;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (make) where.make = { contains: make, mode: 'insensitive' };
    if (model) where.model = { contains: model, mode: 'insensitive' };
    if (category) where.category = { contains: category, mode: 'insensitive' };
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const [data, total] = await Promise.all([
      prisma.vehicle.findMany({ where, skip, take: limit }),
      prisma.vehicle.count({ where })
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  async update(id: string, data: any): Promise<any> {
    const { error, value } = vehicleValidation.update.validate(data);
    if (error) {
      const err: any = new Error(error.details[0].message);
      err.statusCode = 400;
      throw err;
    }

    const existing = await prisma.vehicle.findUnique({ where: { id } });
    if (!existing) {
      const err: any = new Error('Vehicle not found');
      err.statusCode = 404;
      throw err;
    }

    const updated = await prisma.vehicle.update({
      where: { id },
      data: value
    });

    // Auto-regenerate AI Market Intelligence Baseline on update
    try {
      return await generateAndStoreMarketAnalysis(id);
    } catch (e) {
      console.error('[VehicleService] Warning: Failed to auto-generate AI analysis on update:', e);
      return updated;
    }
  },

  async delete(id: string): Promise<any> {
    const existing = await prisma.vehicle.findUnique({ where: { id } });
    if (!existing) {
      const err: any = new Error('Vehicle not found');
      err.statusCode = 404;
      throw err;
    }

    return prisma.vehicle.delete({
      where: { id }
    });
  },

  async purchase(id: string, userId: string = 'guest', payload: any = {}): Promise<any> {
    return orderService.createOrder({
      vehicleId: id,
      userId,
      quantity: payload?.quantity || 1,
      deliveryInfo: payload?.deliveryInfo
    });
  },

  async restock(id: string, amount: number): Promise<any> {
    if (!amount || amount < 1) {
      const err: any = new Error('Invalid amount');
      err.statusCode = 400;
      throw err;
    }

    const vehicle = await prisma.vehicle.findUnique({ where: { id } });
    if (!vehicle) {
      const err: any = new Error('Vehicle not found');
      err.statusCode = 404;
      throw err;
    }

    return prisma.vehicle.update({
      where: { id },
      data: { quantity: vehicle.quantity + amount }
    });
  }
};
