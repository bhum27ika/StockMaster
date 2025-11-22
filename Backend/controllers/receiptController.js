import Receipt from '../models/Receipt.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

export const createReceipt = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { referenceNo, supplier, items = [], warehouse, notes } = req.body;
    // create receipt document
    const [receipt] = await Receipt.create([{ referenceNo, supplier, items, warehouse, notes, receivedBy: req.user?.id }], { session });

    // update product locations and totals
    for (const it of items) {
      const prod = await Product.findById(it.product).session(session);
      if (!prod) throw new Error(`Product ${it.product} not found`);
      const locIndex = prod.locations.findIndex(l => l.locationName === it.locationName);
      if (locIndex === -1) {
        prod.locations.push({ locationName: it.locationName, quantity: Number(it.quantity) });
      } else {
        prod.locations[locIndex].quantity = (prod.locations[locIndex].quantity || 0) + Number(it.quantity);
      }
      prod.totalQuantity = (prod.totalQuantity || 0) + Number(it.quantity);
      await prod.save({ session });
    }

    await session.commitTransaction();
    session.endSession();
    res.status(201).json(receipt);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: err.message });
  }
};

export const getReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find().populate('items.product').sort({ createdAt: -1 });
    res.json(receipts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReceiptById = async (req, res) => {
  try {
    const r = await Receipt.findById(req.params.id).populate('items.product');
    if (!r) return res.status(404).json({ error: 'Receipt not found' });
    res.json(r);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
