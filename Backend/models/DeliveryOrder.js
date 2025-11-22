import mongoose from 'mongoose';

const DeliveryItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, default: 0 },
  total: { type: Number, required: true },
  locationName: { type: String, required: true }
}, { _id: false });

const DeliveryOrderSchema = new mongoose.Schema({
  orderNo: { type: String, required: true, unique: true },
  customer: { type: String },
  items: { type: [DeliveryItemSchema], default: [] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'pending' },
  warehouse: { type: String },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('DeliveryOrder', DeliveryOrderSchema);
