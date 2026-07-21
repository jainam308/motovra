import { registerSchema } from '../auth.validation';

describe('Auth Validation - registerSchema', () => {
  it('should accept valid email and password', () => {
    const result = registerSchema.validate({ email: 'test@example.com', password: 'password123' });
    expect(result.error).toBeUndefined();
  });

  it('should reject invalid email', () => {
    const result = registerSchema.validate({ email: 'not-an-email', password: 'password123' });
    expect(result.error).toBeDefined();
    expect(result.error?.details[0].message).toMatch(/email/i);
  });

  it('should reject password shorter than 8 characters', () => {
    const result = registerSchema.validate({ email: 'test@example.com', password: 'short' });
    expect(result.error).toBeDefined();
    expect(result.error?.details[0].message).toMatch(/password/i);
  });
});
