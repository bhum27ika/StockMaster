import mongoose from 'mongoose';

const TransferItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true }
}, { _id: false });

const TransferSchema = new mongoose.Schema({
  transferNo: { type: String, required: true, unique: true },
  fromLocation: { type: String, required: true },
  toLocation: { type: String, required: true },
  items: { type: [TransferItemSchema], default: [] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, default: 'completed' },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Transfer', TransferSchema);
