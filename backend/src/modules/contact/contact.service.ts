import { PrismaClient } from '@prisma/client';
import { emailService } from '../../common/services/email.service';

const prisma = new PrismaClient();

export interface CreateContactInquiryPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const contactService = {
  /**
   * Create Contact Inquiry + Trigger Emails
   */
  async createInquiry(payload: CreateContactInquiryPayload) {
    const { name, email, subject, message } = payload;

    if (!name || !name.trim()) {
      const err: any = new Error('Name is required');
      err.statusCode = 400;
      throw err;
    }

    if (!email || !email.trim()) {
      const err: any = new Error('Email is required');
      err.statusCode = 400;
      throw err;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      const err: any = new Error('Invalid email format');
      err.statusCode = 400;
      throw err;
    }

    if (!subject || !subject.trim()) {
      const err: any = new Error('Subject is required');
      err.statusCode = 400;
      throw err;
    }

    if (!message || !message.trim()) {
      const err: any = new Error('Message is required');
      err.statusCode = 400;
      throw err;
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        subject: subject.trim(),
        message: message.trim(),
      },
    });

    // TDD Cycle 2: Send Admin Inquiry Notification
    await emailService.sendAdminInquiryNotification({
      name: inquiry.name,
      email: inquiry.email,
      subject: inquiry.subject,
      message: inquiry.message,
    });

    // TDD Cycle 3: Send Customer Confirmation Email
    await emailService.sendCustomerConfirmationEmail({
      name: inquiry.name,
      email: inquiry.email,
      subject: inquiry.subject,
    });

    return inquiry;
  },
};
