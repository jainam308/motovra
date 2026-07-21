import { requireRole } from '../requireRole';
import { requireAuth } from '../requireAuth';
import { ForbiddenError } from '../../errors/ForbiddenError';
import { UnauthorizedError } from '../../errors/UnauthorizedError';

describe('requireAuth Middleware', () => {
  it('should call next with UnauthorizedError if no authorization header is provided', () => {
    const req = { headers: {} } as any;
    const res = {} as any;
    const next = jest.fn();

    requireAuth(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
  });
});

describe('requireRole Middleware', () => {
  it('should call next with ForbiddenError if user role does not match', () => {
    const middleware = requireRole('ADMIN');
    const req = { user: { role: 'CUSTOMER' } } as any;
    const res = {} as any;
    const next = jest.fn();

    middleware(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(ForbiddenError));
  });

  it('should call next if user role matches', () => {
    const middleware = requireRole('ADMIN');
    const req = { user: { role: 'ADMIN' } } as any;
    const res = {} as any;
    const next = jest.fn();

    middleware(req, res, next);
    expect(next).toHaveBeenCalledWith();
  });
});
