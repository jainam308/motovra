import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

export const jwtUtils = {
  generateAccessToken(payload: string | object | Buffer): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  },

  generateRefreshToken(payload: string | object | Buffer): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  },

  verifyAccessToken(token: string): any {
    return jwt.verify(token, JWT_SECRET);
  },

  verifyRefreshToken(token: string): any {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  }
};
