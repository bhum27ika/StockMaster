import express from 'express';
import { createAdjustment, getAdjustments } from '../controllers/adjustmentController.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/', authMiddleware, createAdjustment);
router.get('/', authMiddleware, getAdjustments);
export default router;
