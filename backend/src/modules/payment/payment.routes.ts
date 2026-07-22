import { Router } from 'express';
import { paymentController } from './payment.controller';
import { requireAuth, optionalAuth } from '../../common/middlewares/requireAuth';

const router = Router();

// Allow authenticated customers to create Razorpay payment order
router.post('/create-order', requireAuth, paymentController.createOrder);

// Verify signature & finalize booking (supports authenticated & guest)
router.post('/verify', optionalAuth, paymentController.verifyPayment);

export default router;
