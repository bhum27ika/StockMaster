import express from 'express';
import { createReceipt, getReceipts, getReceiptById } from '../controllers/receiptController.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/', authMiddleware, createReceipt);
router.get('/', authMiddleware, getReceipts);
router.get('/:id', authMiddleware, getReceiptById);
export default router;
