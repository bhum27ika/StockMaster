// import express from 'express';
// import { createProduct, getProducts, getProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
// import authMiddleware from '../middleware/authMiddleware.js';
// const router = express.Router();
// router.post('/', authMiddleware, createProduct);
// router.get('/', authMiddleware, getProducts);
// router.get('/:id', authMiddleware, getProduct);
// router.put('/:id', authMiddleware, updateProduct);
// router.delete('/:id', authMiddleware, deleteProduct);
// export default router;

// routes/productRoutes.js
import express from 'express';
import {
  lookupProductByBarcode,
  searchExternalProducts,
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Barcode lookup - should come before /:id route
router.get('/lookup/:barcode', lookupProductByBarcode);

// External product search
router.get('/search-external', searchExternalProducts);

// Standard CRUD routes
router.route('/')
  .get(getAllProducts)
  .post(createProduct);

router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

export default router;