import { contactService } from '../contact.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Contact Service - TDD Cycle 1 (RED 1)', () => {
  afterAll(async () => {
    await prisma.contactInquiry.deleteMany({
      where: { email: { contains: 'testcontact' } },
    });
    await prisma.$disconnect();
  });

  it('should submit contact inquiry successfully with valid payload', async () => {
    const payload = {
      name: 'John Doe',
      email: 'john.testcontact@example.com',
      subject: 'Booking Query',
      message: 'I would like to know the delivery time.',
    };

    const inquiry = await contactService.createInquiry(payload);

    expect(inquiry).toHaveProperty('id');
    expect(inquiry.name).toBe(payload.name);
    expect(inquiry.email).toBe(payload.email);
    expect(inquiry.subject).toBe(payload.subject);
    expect(inquiry.message).toBe(payload.message);
  });

  it('should reject submission when name is missing', async () => {
    await expect(
      contactService.createInquiry({
        name: '',
        email: 'valid.testcontact@example.com',
        subject: 'Query',
        message: 'Hello',
      })
    ).rejects.toThrow('Name is required');
  });

  it('should reject submission when email is missing', async () => {
    await expect(
      contactService.createInquiry({
        name: 'John Doe',
        email: '',
        subject: 'Query',
        message: 'Hello',
      })
    ).rejects.toThrow('Email is required');
  });

  it('should reject submission when email format is invalid', async () => {
    await expect(
      contactService.createInquiry({
        name: 'John Doe',
        email: 'invalid-email-format',
        subject: 'Query',
        message: 'Hello',
      })
    ).rejects.toThrow('Invalid email format');
  });

  it('should reject submission when subject is missing', async () => {
    await expect(
      contactService.createInquiry({
        name: 'John Doe',
        email: 'john.testcontact@example.com',
        subject: '',
        message: 'Hello',
      })
    ).rejects.toThrow('Subject is required');
  });

  it('should reject submission when message is missing', async () => {
    await expect(
      contactService.createInquiry({
        name: 'John Doe',
        email: 'john.testcontact@example.com',
        subject: 'Query',
        message: '',
      })
    ).rejects.toThrow('Message is required');
  });
});
