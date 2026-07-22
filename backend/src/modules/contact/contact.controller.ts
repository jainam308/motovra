import { Request, Response, NextFunction } from 'express';
import { contactService } from './contact.service';

export const contactController = {
  /**
   * POST /api/contact
   */
  async submitInquiry(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, subject, message } = req.body;

      const inquiry = await contactService.createInquiry({
        name,
        email,
        subject,
        message,
      });

      return res.status(201).json({
        message: 'Inquiry submitted successfully',
        inquiry,
      });
    } catch (error) {
      next(error);
    }
  },
};
