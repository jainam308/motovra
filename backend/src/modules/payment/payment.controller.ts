import { Request, Response, NextFunction } from 'express';
import { paymentService } from './payment.service';

export const paymentController = {
  /**
   * POST /api/payments/create-order
   */
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { vehicleId, bookingAmount } = req.body;
      if (!vehicleId) {
        return res.status(400).json({ error: 'vehicleId is required' });
      }

      const result = await paymentService.createRazorpayOrder({
        vehicleId,
        bookingAmount: bookingAmount ? Number(bookingAmount) : undefined,
      });

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/payments/verify
   */
  async verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        vehicleId,
        deliveryInfo,
        bookingAmount,
      } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ error: 'Razorpay order ID, payment ID, and signature are required' });
      }

      if (!vehicleId) {
        return res.status(400).json({ error: 'vehicleId is required' });
      }

      if (!deliveryInfo || !deliveryInfo.fullName || !deliveryInfo.phone || !deliveryInfo.addressLine || !deliveryInfo.city || !deliveryInfo.state || !deliveryInfo.postalCode) {
        return res.status(400).json({ error: 'Complete deliveryInfo is required' });
      }

      const userId = (req as any).user?.id || (req as any).user?.userId || null;

      const result = await paymentService.verifyPaymentAndCreateOrder({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        vehicleId,
        userId,
        deliveryInfo,
        bookingAmount: bookingAmount ? Number(bookingAmount) : undefined,
      });

      return res.status(201).json({
        message: 'Payment verified and booking confirmed successfully',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  },
};
