import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import './google.strategy';

export const authController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const tokens = await authService.login(email, password);
      
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(200).json({ accessToken: tokens.accessToken });
    } catch (error) {
      next(error);
    }
  },

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.refreshToken;
      const tokens = await authService.refresh(token);
      
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(200).json({ accessToken: tokens.accessToken });
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.refreshToken;
      if (token) {
        await authService.logout(token);
      }
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  },

  async googleAuth(req: Request, res: Response, next: NextFunction) {
    const nonce = crypto.randomBytes(16).toString('hex');
    const state = jwt.sign({ nonce }, process.env.JWT_SECRET!, { expiresIn: '5m' });
    
    res.cookie('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 5 * 60 * 1000,
      sameSite: 'lax'
    });

    passport.authenticate('google', { 
      session: false, 
      scope: ['profile', 'email'],
      state
    })(req, res, next);
  },

  async googleCallback(req: Request, res: Response, next: NextFunction) {
    const returnedState = req.query.state as string;
    const cookieState = req.cookies?.oauth_state;

    if (!returnedState || !cookieState || returnedState !== cookieState) {
      return res.status(401).json({ error: 'State mismatch CSRF protection failed' });
    }

    try {
      jwt.verify(returnedState, process.env.JWT_SECRET!);
    } catch (e) {
      return res.status(401).json({ error: 'Invalid or expired state' });
    }

    res.clearCookie('oauth_state');

    passport.authenticate('google', { session: false }, async (err: any, profile: any) => {
      if (err) return next(err);
      if (!profile) return res.status(401).json({ error: 'Google authentication failed' });

      try {
        const tokens = await authService.googleLogin(profile);

        res.cookie('refreshToken', tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ accessToken: tokens.accessToken });
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  }
};
