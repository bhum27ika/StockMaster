import Adjustment from '../models/Adjustment.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

export const createAdjustment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { adjustmentNo, type, items = [], notes } = req.body;
    const [adj] = await Adjustment.create([{ adjustmentNo, type, items, notes, createdBy: req.user?.id }], { session });

    for (const it of items) {
      const prod = await Product.findById(it.product).session(session);
      if (!prod) throw new Error(`Product ${it.product} not found`);
      const locIndex = prod.locations.findIndex(l => l.locationName === it.locationName);
      const qty = Number(it.quantity);
      if (type === 'increase') {
        if (locIndex === -1) {
          prod.locations.push({ locationName: it.locationName, quantity: qty });
        } else {
          prod.locations[locIndex].quantity = (prod.locations[locIndex].quantity || 0) + qty;
        }
        prod.totalQuantity = (prod.totalQuantity || 0) + qty;
      } else {
        // decrease
        if (locIndex === -1) throw new Error(`Location ${it.locationName} not found for product ${prod.name}`);
        if ((prod.locations[locIndex].quantity || 0) < qty) throw new Error(`Insufficient stock at ${it.locationName}`);
        prod.locations[locIndex].quantity = prod.locations[locIndex].quantity - qty;
        prod.totalQuantity = prod.totalQuantity - qty;
      }
      await prod.save({ session });
    }

    await session.commitTransaction();
    session.endSession();
    res.status(201).json(adj);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: err.message });
  }
};

export const getAdjustments = async (req, res) => {
  try {
    const list = await Adjustment.find().populate('items.product').sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
