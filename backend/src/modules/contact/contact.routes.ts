import { Router } from 'express';
import { contactController } from './contact.controller';

const router = Router();

// Public endpoint for submitting contact inquiries
router.post('/', contactController.submitInquiry);

export default router;
