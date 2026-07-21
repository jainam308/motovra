import { Router } from 'express';
import { vehicleController } from './vehicle.controller';
import { requireAuth } from '../../common/middlewares/requireAuth';
import { requireRole } from '../../common/middlewares/requireRole';

const router = Router();
router.post('/', requireAuth, requireRole('ADMIN'), vehicleController.create);
router.get('/', vehicleController.list);
router.get('/search', vehicleController.list);
router.put('/:id', requireAuth, requireRole('ADMIN'), vehicleController.update);
router.delete('/:id', requireAuth, requireRole('ADMIN'), vehicleController.delete);

export default router;
