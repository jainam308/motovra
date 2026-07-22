import { Request, Response, NextFunction } from 'express';
import { orderService } from './order.service';

export const orderController = {
  async getUserOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const orders = await orderService.getUserOrders(userId);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  },

  async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.userId;
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const { id } = req.params;
      const order = await orderService.getOrderById(id, userId);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }
};
