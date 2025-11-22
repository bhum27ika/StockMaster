import express from 'express';
import { createDelivery, getDeliveries, getDeliveryById } from '../controllers/deliveryController.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/', authMiddleware, createDelivery);
router.get('/', authMiddleware, getDeliveries);
router.get('/:id', authMiddleware, getDeliveryById);
export default router;
