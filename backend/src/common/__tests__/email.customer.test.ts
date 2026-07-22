import { emailService } from '../services/email.service';
import { contactService } from '../../modules/contact/contact.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Customer Confirmation Email - TDD Cycle 3 (RED 3 & GREEN 3)', () => {
  afterAll(async () => {
    await prisma.contactInquiry.deleteMany({
      where: { email: { contains: 'customeremailtest' } },
    });
    await prisma.$disconnect();
  });

  it('should trigger customer confirmation email with thank-you message and subject', async () => {
    const sendCustomerSpy = jest.spyOn(emailService, 'sendCustomerConfirmationEmail');

    const payload = {
      name: 'Sarah Customer',
      email: 'sarah.customeremailtest@example.com',
      subject: 'Custom Interior Inquiry',
      message: 'Can I get custom leather seats?',
    };

    await contactService.createInquiry(payload);

    expect(sendCustomerSpy).toHaveBeenCalledWith({
      name: payload.name,
      email: payload.email,
      subject: payload.subject,
    });

    sendCustomerSpy.mockRestore();
  });

  it('should NOT send customer confirmation email if inquiry creation fails', async () => {
    const sendCustomerSpy = jest.spyOn(emailService, 'sendCustomerConfirmationEmail');

    await expect(
      contactService.createInquiry({
        name: 'Sarah',
        email: 'invalid-email',
        subject: 'Custom Interior',
        message: 'Message',
      })
    ).rejects.toThrow();

    expect(sendCustomerSpy).not.toHaveBeenCalled();

    sendCustomerSpy.mockRestore();
  });
});
