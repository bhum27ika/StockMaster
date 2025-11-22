import Transfer from '../models/Transfer.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

export const createTransfer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { transferNo, fromLocation, toLocation, items = [], notes } = req.body;
    const [transfer] = await Transfer.create([{ transferNo, fromLocation, toLocation, items, notes, createdBy: req.user?.id }], { session });

    for (const it of items) {
      const prod = await Product.findById(it.product).session(session);
      if (!prod) throw new Error(`Product ${it.product} not found`);
      const from = prod.locations.find(l => l.locationName === fromLocation);
      if (!from) throw new Error(`Source location ${fromLocation} not found for product ${prod.name}`);
      if ((from.quantity || 0) < Number(it.quantity)) throw new Error(`Insufficient stock in source location ${fromLocation}`);
      from.quantity = from.quantity - Number(it.quantity);
      let to = prod.locations.find(l => l.locationName === toLocation);
      if (!to) {
        prod.locations.push({ locationName: toLocation, quantity: Number(it.quantity) });
      } else {
        to.quantity = (to.quantity || 0) + Number(it.quantity);
      }
      // totalQuantity unchanged (it's internal move)
      await prod.save({ session });
    }

    await session.commitTransaction();
    session.endSession();
    res.status(201).json(transfer);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: err.message });
  }
};

export const getTransfers = async (req, res) => {
  try {
    const list = await Transfer.find().populate('items.product').sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
