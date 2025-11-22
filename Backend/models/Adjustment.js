import mongoose from 'mongoose';

const AdjustmentItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true }, // positive or negative based on type
  reason: { type: String }
}, { _id: false });

const AdjustmentSchema = new mongoose.Schema({
  adjustmentNo: { type: String, required: true, unique: true },
  type: { type: String, enum: ['increase','decrease'], required: true },
  items: { type: [AdjustmentItemSchema], default: [] },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Adjustment', AdjustmentSchema);
