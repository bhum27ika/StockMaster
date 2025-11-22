// config/config.js
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file in Backend root
dotenv.config({ path: join(__dirname, '..', '.env') });

// Debug: Log loaded environment variables
console.log('🔧 Loading configuration...');
console.log('📂 NODE_ENV:', process.env.NODE_ENV);
console.log('🔌 PORT:', process.env.PORT);
console.log('🗄️  MONGODB_URI:', process.env.MONGODB_URI ? '✅ Loaded' : '❌ Missing');
console.log('🔐 JWT_SECRET:', process.env.JWT_SECRET ? '✅ Loaded' : '❌ Missing');

export const config = {
  // Server
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,

  // Database - Support both MONGODB_URI and MONGO_URL
  mongodbUri: process.env.MONGODB_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/stockmaster',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'default-secret-change-in-production',
  jwtExpire: process.env.JWT_EXPIRE || '30d',

  // Email - Support both naming conventions
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD || '',
  },

  // Open Food Facts API
  openFoodFacts: {
    apiUrl: process.env.OPENFOODFACTS_API_URL || 'https://world.openfoodfacts.org/api/v0',
    userAgent: process.env.OPENFOODFACTS_USER_AGENT || 'StockMaster-IMS/1.0',
    timeout: parseInt(process.env.OPENFOODFACTS_TIMEOUT) || 5000,
    country: process.env.OPENFOODFACTS_COUNTRY || 'world',
  },
};

// Validate critical environment variables
if (!process.env.MONGODB_URI) {
  console.warn('⚠️  Warning: MONGODB_URI not set in .env, using default: mongodb://localhost:27017/stockmaster');
}

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  Warning: JWT_SECRET not set in .env, using default (NOT SECURE FOR PRODUCTION)');
}

console.log('✅ Configuration loaded successfully');

export default config;