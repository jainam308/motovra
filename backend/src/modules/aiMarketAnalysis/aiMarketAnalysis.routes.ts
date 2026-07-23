import { Router } from 'express';
import { regenerateAiMarketAnalysis } from './aiMarketAnalysis.controller';
import { requireAuth } from '../../common/middlewares/requireAuth';
import { requireRole } from '../../common/middlewares/requireRole';

const router = Router();

/**
 * @swagger
 * /api/ai-market-analysis/{vehicleId}:
 *   post:
 *     summary: Regenerate AI Market Intelligence Analysis for a vehicle (Admin only)
 *     tags: [AI Market Intelligence]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Analysis updated successfully
 *       404:
 *         description: Vehicle not found
 */
router.post('/:vehicleId', requireAuth, requireRole('ADMIN'), regenerateAiMarketAnalysis);

export default router;
