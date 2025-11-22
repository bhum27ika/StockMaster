import express from 'express';
import { createTransfer, getTransfers } from '../controllers/transferController.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/', authMiddleware, createTransfer);
router.get('/', authMiddleware, getTransfers);
export default router;
