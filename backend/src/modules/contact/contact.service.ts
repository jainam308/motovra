import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateContactInquiryPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const contactService = {
  /**
   * TDD Cycle 1: Create Contact Inquiry
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

    return inquiry;
  },
};
