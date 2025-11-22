// routes/testRoutes.js
import express from 'express';
import openFoodFactsService from '../utils/openFoodFactsService.js';

const router = express.Router();

// Test Open Food Facts API without authentication
router.get('/openfoodfacts/:barcode', async (req, res) => {
  try {
    const { barcode } = req.params;
    
    console.log('Testing Open Food Facts API for barcode:', barcode);
    
    const productData = await openFoodFactsService.getProductByBarcode(barcode);
    
    res.status(200).json({
      success: true,
      message: 'Open Food Facts API is working',
      data: productData
    });
  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch from Open Food Facts',
      error: error.message
    });
  }
});

// Test search
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1 } = req.query;
    
    console.log('Testing search for:', query);
    
    const results = await openFoodFactsService.searchProducts(query, page);
    
    res.status(200).json({
      success: true,
      message: 'Search successful',
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Search test error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
});

export default router;