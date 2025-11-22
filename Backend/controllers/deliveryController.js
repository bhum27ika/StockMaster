import DeliveryOrder from '../models/DeliveryOrder.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

export const createDelivery = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { orderNo, customer, items = [], warehouse, notes } = req.body;
    const [delivery] = await DeliveryOrder.create([{ orderNo, customer, items, warehouse, notes, createdBy: req.user?.id }], { session });

    for (const it of items) {
      const prod = await Product.findById(it.product).session(session);
      if (!prod) throw new Error(`Product ${it.product} not found`);
      const loc = prod.locations.find(l => l.locationName === it.locationName);
      if (!loc) throw new Error(`No stock at location ${it.locationName} for product ${prod.name}`);
      if ((loc.quantity || 0) < Number(it.quantity)) throw new Error(`Insufficient stock in ${it.locationName} for product ${prod.name}`);
      loc.quantity = loc.quantity - Number(it.quantity);
      prod.totalQuantity = prod.totalQuantity - Number(it.quantity);
      await prod.save({ session });
    }

    await session.commitTransaction();
    session.endSession();
    res.status(201).json(delivery);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ error: err.message });
  }
};

export const getDeliveries = async (req, res) => {
  try {
    const items = await DeliveryOrder.find().populate('items.product').sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getDeliveryById = async (req, res) => {
  try {
    const d = await DeliveryOrder.findById(req.params.id).populate('items.product');
    if (!d) return res.status(404).json({ error: 'Delivery not found' });
    res.json(d);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
