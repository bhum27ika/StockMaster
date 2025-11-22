// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cors from 'cors';

// import productRoutes from './routes/productRoutes.js';
// import receiptRoutes from './routes/receiptRoutes.js';
// import deliveryRoutes from './routes/deliveryRoutes.js';
// import transferRoutes from './routes/transferRoutes.js';
// import adjustmentRoutes from './routes/adjustmentRoutes.js';
// import authRoutes from './routes/authRoutes.js';   // <-- FIXED

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // DB Connection
// const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stockmaster';

// mongoose.connect(MONGO)
//   .then(()=> console.log('MongoDB connected'))
//   .catch(err=> console.error('MongoDB error:', err.message));

// // Routes
// app.use('/api/products', productRoutes);
// app.use('/api/receipts', receiptRoutes);
// app.use('/api/deliveries', deliveryRoutes);
// app.use('/api/transfers', transferRoutes);
// app.use('/api/adjustments', adjustmentRoutes);
// app.use('/api/auth', authRoutes);  

// app.get('/', (req,res)=> res.send('Badhiya chal raha hai'));

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, ()=> console.log(`http://localhost:${PORT}`));

// server.js (Simplified version)
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables FIRST
dotenv.config();

// Debug: Check if env vars are loaded
console.log('🔧 Environment Variables Check:');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Loaded' : (process.env.MONGO_URL ? '✅ Loaded (MONGO_URL)' : '❌ Missing'));
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Loaded' : '❌ Missing');
console.log('PORT:', process.env.PORT || 5000);

// Import routes
import testRoutes from './routes/testRoutes.js';  // ✅ UNCOMMENTED

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// MongoDB Connection - Support both MONGODB_URI and MONGO_URL
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/stockmaster';
console.log('🔗 Connecting to MongoDB:', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    console.log('📊 Database:', mongoose.connection.name);
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('💡 Tips:');
    console.error('   1. Make sure MongoDB is running');
    console.error('   2. Check MONGODB_URI in .env file');
    console.error('   3. For local: mongodb://localhost:27017/stockmaster');
    console.error('   4. For Atlas: mongodb+srv://...');
  });

// Health check routes
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'StockMaster API is running',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    endpoints: {
      health: '/health',
      test: '/api/test',
      auth: '/api/auth',
      products: '/api/products'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/test', testRoutes);  // ✅ UNCOMMENTED

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    requestedPath: req.path,
    method: req.method,
    availableRoutes: [
      'GET /',
      'GET /health',
      'GET /api/test/openfoodfacts/:barcode',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/products (requires auth)'
    ]
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('\n ================================');
  console.log(` Server running on port ${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` URL: http://localhost:${PORT}`);
  console.log(' ================================\n');
  console.log(' Test URLs:');
  console.log(`   http://localhost:${PORT}/`);
  console.log(`   http://localhost:${PORT}/health`);
  console.log(`   http://localhost:${PORT}/api/test/openfoodfacts/8901030368898`);
  console.log('\n');
});