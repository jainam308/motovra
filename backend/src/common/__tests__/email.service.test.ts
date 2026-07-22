import { emailService } from '../services/email.service';
import { contactService } from '../../modules/contact/contact.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Email Service & Admin Notification - TDD Cycle 2 (RED 2)', () => {
  afterAll(async () => {
    await prisma.contactInquiry.deleteMany({
      where: { email: { contains: 'adminemailtest' } },
    });
    await prisma.$disconnect();
  });

  it('should format and trigger Brevo admin inquiry notification with customer details', async () => {
    const sendAdminSpy = jest.spyOn(emailService, 'sendAdminInquiryNotification');

    const payload = {
      name: 'John AdminTest',
      email: 'john.adminemailtest@example.com',
      subject: 'Booking Query',
      message: 'I would like to know the delivery time.',
    };

    await contactService.createInquiry(payload);

    expect(sendAdminSpy).toHaveBeenCalledWith({
      name: payload.name,
      email: payload.email,
      subject: payload.subject,
      message: payload.message,
    });

    sendAdminSpy.mockRestore();
  });

  it('should NOT trigger admin email notification if validation fails', async () => {
    const sendAdminSpy = jest.spyOn(emailService, 'sendAdminInquiryNotification');

    await expect(
      contactService.createInquiry({
        name: '',
        email: 'invalid',
        subject: '',
        message: '',
      })
    ).rejects.toThrow();

    expect(sendAdminSpy).not.toHaveBeenCalled();

    sendAdminSpy.mockRestore();
  });
});
