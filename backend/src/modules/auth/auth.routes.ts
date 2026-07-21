import { Router } from 'express';
import { authController } from './auth.controller';

const router = Router();
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);

export default router;
