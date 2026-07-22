import { Router } from 'express';
import { authController } from './auth.controller';
import passport from 'passport';
import './google.strategy';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication and identity management
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login to an account
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new account
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Account created, returns tokens
 *       409:
 *         description: Email already in use
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200:
 *         description: New access token
 *       401:
 *         description: Invalid or missing refresh token
 */
router.post('/refresh', authController.refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout and invalidate tokens
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post('/logout', authController.logout);

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Initiate Google OAuth flow
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       302:
 *         description: Redirects to Google consent screen
 */
router.get(
  '/google',
  passport.authenticate('google', { session: false, scope: ['profile', 'email'] })
);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     security: []
 *     responses:
 *       302:
 *         description: Redirects to frontend with tokens
 *       401:
 *         description: OAuth failed
 */
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: 'http://localhost:5173/login?error=google_failed',
  }),
  authController.googleCallback
);

export default router;
