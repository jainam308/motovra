import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './modules/auth/auth.routes';
import vehicleRoutes from './modules/vehicle/vehicle.routes';
import orderRoutes from './modules/order/order.routes';
import paymentRoutes from './modules/payment/payment.routes';
import contactRoutes from './modules/contact/contact.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import aiMarketAnalysisRoutes from './modules/aiMarketAnalysis/aiMarketAnalysis.routes';
import { setupSwagger } from './swagger';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like curl or postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai-market-analysis', aiMarketAnalysisRoutes);

// Health check and root endpoints
app.get(['/', '/health', '/api/health'], (req, res) => {
  res.status(200).json({ status: 'ok', message: 'MotoVra API is running' });
});

// Fallback redirects if user or browser accesses /auth/google directly without /api prefix
app.get('/auth/google', (req, res) => {
  res.redirect('/api/auth/google');
});
app.get('/auth/google/callback', (req, res) => {
  const query = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
  res.redirect(`/api/auth/google/callback${query}`);
});

setupSwagger(app);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[ERROR]', err.message || err);
  const status = err.statusCode || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
});

export default app;
