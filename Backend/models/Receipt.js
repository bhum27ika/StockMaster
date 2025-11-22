import mongoose from 'mongoose';

const ReceiptItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, default: 0 },
  total: { type: Number, required: true },
  locationName: { type: String, required: true }
}, { _id: false });

const ReceiptSchema = new mongoose.Schema({
  referenceNo: { type: String, required: true, unique: true },
  supplier: { type: String },
  items: { type: [ReceiptItemSchema], default: [] },
  receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  warehouse: { type: String },
  status: { type: String, default: 'received' },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Receipt', ReceiptSchema);
