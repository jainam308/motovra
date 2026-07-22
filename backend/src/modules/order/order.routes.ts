import { Router } from 'express';
import { requireAuth } from '../../common/middlewares/requireAuth';
import { orderController } from './order.controller';

const router = Router();

router.use(requireAuth);

router.get('/', orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);

export default router;
