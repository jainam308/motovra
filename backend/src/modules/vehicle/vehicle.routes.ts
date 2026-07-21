import { Router } from 'express';
import { vehicleController } from './vehicle.controller';
import { requireAuth } from '../../common/middlewares/requireAuth';
import { requireRole } from '../../common/middlewares/requireRole';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Vehicles
 *   description: Vehicle inventory management
 */

/**
 * @swagger
 * /api/vehicles:
 *   post:
 *     summary: Create a new vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [make, model, category, price, quantity]
 *             properties:
 *               make:
 *                 type: string
 *               model:
 *                 type: string
 *               category:
 *                 type: string
 *               price:
 *                 type: number
 *               quantity:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden (Admin only)
 */
router.post('/', requireAuth, requireRole('ADMIN'), vehicleController.create);

/**
 * @swagger
 * /api/vehicles:
 *   get:
 *     summary: List all vehicles
 *     tags: [Vehicles]
 *     security: []
 *     responses:
 *       200:
 *         description: Paginated list of vehicles
 */
router.get('/', vehicleController.list);

/**
 * @swagger
 * /api/vehicles/search:
 *   get:
 *     summary: Search for vehicles
 *     tags: [Vehicles]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: make
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Search results
 *       400:
 *         description: Invalid filters
 */
router.get('/search', vehicleController.list);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   put:
 *     summary: Update a vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Vehicle updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Vehicle not found
 */
router.put('/:id', requireAuth, requireRole('ADMIN'), vehicleController.update);

/**
 * @swagger
 * /api/vehicles/{id}:
 *   delete:
 *     summary: Delete a vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Vehicle deleted
 *       404:
 *         description: Vehicle not found
 */
router.delete('/:id', requireAuth, requireRole('ADMIN'), vehicleController.delete);

/**
 * @swagger
 * /api/vehicles/{id}/purchase:
 *   post:
 *     summary: Purchase a vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Purchase successful
 *       409:
 *         description: Out of stock or concurrency conflict
 *       404:
 *         description: Vehicle not found
 */
router.post('/:id/purchase', requireAuth, vehicleController.purchase);

/**
 * @swagger
 * /api/vehicles/{id}/restock:
 *   post:
 *     summary: Restock a vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Restock successful
 *       400:
 *         description: Invalid amount
 *       404:
 *         description: Vehicle not found
 */
router.post('/:id/restock', requireAuth, requireRole('ADMIN'), vehicleController.restock);

export default router;
