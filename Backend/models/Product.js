// import mongoose from 'mongoose';

// const LocationSchema = new mongoose.Schema({
//   locationName: { type: String, required: true },
//   quantity: { type: Number, required: true, default: 0 }
// }, { _id: false });

// const ProductSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   productCode: { type: String, required: true, unique: true, index: true },
//   description: { type: String },
//   totalQuantity: { type: Number, default: 0 },
//   unitPrice: { type: Number, default: 0 },
//   category: { type: String },
//   locations: { type: [LocationSchema], default: [] },
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
// }, { timestamps: true });

// export default mongoose.model('Product', ProductSchema);

// models/Product.js
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  barcode: {
    type: String,
    trim: true,
    index: true // Index for faster barcode searches
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  unitOfMeasure: {
    type: String,
    required: [true, 'Unit of measure is required'],
    enum: ['unit', 'kg', 'g', 'L', 'ml', 'box', 'pcs', 'dozen'],
    default: 'unit'
  },
  weight: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  stockLocations: [{
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse'
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0
    },
    location: {
      type: String, // Rack A, Shelf B, etc.
      trim: true
    }
  }],
  reorderLevel: {
    type: Number,
    default: 10,
    min: 0
  },
  reorderQuantity: {
    type: Number,
    default: 50,
    min: 0
  },
  costPrice: {
    type: Number,
    min: 0
  },
  sellingPrice: {
    type: Number,
    min: 0
  },
  additionalInfo: {
    type: Object,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for performance
productSchema.index({ name: 'text', sku: 'text', barcode: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ 'stockLocations.warehouse': 1 });

// Virtual for total stock across all locations
productSchema.virtual('totalStock').get(function() {
  return this.stockLocations.reduce((total, loc) => total + loc.quantity, 0);
});

// Virtual to check if stock is low
productSchema.virtual('isLowStock').get(function() {
  return this.totalStock < this.reorderLevel;
});

// Virtual to check if out of stock
productSchema.virtual('isOutOfStock').get(function() {
  return this.totalStock === 0;
});

// Method to get stock at specific warehouse
productSchema.methods.getStockAtWarehouse = function(warehouseId) {
  const location = this.stockLocations.find(
    loc => loc.warehouse.toString() === warehouseId.toString()
  );
  return location ? location.quantity : 0;
};

// Method to update stock at warehouse
productSchema.methods.updateStockAtWarehouse = async function(warehouseId, quantity, operation = 'set') {
  const locationIndex = this.stockLocations.findIndex(
    loc => loc.warehouse.toString() === warehouseId.toString()
  );

  if (locationIndex === -1) {
    // Location doesn't exist, create it
    this.stockLocations.push({
      warehouse: warehouseId,
      quantity: operation === 'add' ? quantity : (operation === 'subtract' ? 0 : quantity)
    });
  } else {
    // Location exists, update quantity
    if (operation === 'add') {
      this.stockLocations[locationIndex].quantity += quantity;
    } else if (operation === 'subtract') {
      this.stockLocations[locationIndex].quantity -= quantity;
      if (this.stockLocations[locationIndex].quantity < 0) {
        throw new Error('Insufficient stock at this location');
      }
    } else {
      this.stockLocations[locationIndex].quantity = quantity;
    }
  }

  await this.save();
  return this;
};

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export default mongoose.model('Product', productSchema);
