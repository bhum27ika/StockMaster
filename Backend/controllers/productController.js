// import Product from '../models/Product.js';

// export const createProduct = async (req, res) => {
//   try {
//     const { name, productCode, description, unitPrice, category, locations = [] } = req.body;
//     // compute totalQuantity from locations
//     const totalQuantity = locations.reduce((s, l) => s + Number(l.quantity || 0), 0);
//     const p = await Product.create({ name, productCode, description, unitPrice, category, locations, totalQuantity, createdBy: req.user?.id });
//     res.status(201).json(p);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// export const getProducts = async (req, res) => {
//   try {
//     const products = await Product.find().sort({ createdAt: -1 });
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const getProduct = async (req, res) => {
//   try {
//     const p = await Product.findById(req.params.id);
//     if (!p) return res.status(404).json({ error: 'Product not found' });
//     res.json(p);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// export const updateProduct = async (req, res) => {
//   try {
//     const payload = req.body;
//     // if locations updated, recalc totalQuantity
//     if (payload.locations) {
//       payload.totalQuantity = payload.locations.reduce((s, l) => s + Number(l.quantity || 0), 0);
//     }
//     const p = await Product.findByIdAndUpdate(req.params.id, payload, { new: true });
//     res.json(p);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// export const deleteProduct = async (req, res) => {
//   try {
//     await Product.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Product deleted' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// controllers/productController.js
import Product from '../models/Product.js';
import Receipt from '../models/Receipt.js';
import openFoodFactsService from '../utils/openFoodFactsService.js';

/**
 * Fetch product info from Open Food Facts by barcode
 * @route GET /api/products/lookup/:barcode
 */
export const lookupProductByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;

    // Validate barcode format
    if (!barcode || !/^\d+$/.test(barcode)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid barcode format'
      });
    }

    // Check if product already exists in your database
    const existingProduct = await Product.findOne({ 
      $or: [
        { sku: barcode },
        { barcode: barcode }
      ]
    });

    if (existingProduct) {
      return res.status(200).json({
        success: true,
        message: 'Product already exists in your inventory',
        existsInInventory: true,
        product: existingProduct
      });
    }

    // Fetch from Open Food Facts
    const productData = await openFoodFactsService.getProductByBarcode(barcode);

    if (!productData.found) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in Open Food Facts database',
        barcode: barcode
      });
    }

    res.status(200).json({
      success: true,
      existsInInventory: false,
      productData: productData
    });

  } catch (error) {
    console.error('Barcode lookup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to lookup product',
      error: error.message
    });
  }
};

/**
 * Create product with optional Open Food Facts integration
 * @route POST /api/products
 */
export const createProduct = async (req, res) => {
  try {
    const { 
      name, 
      sku, 
      barcode, 
      category, 
      unitOfMeasure, 
      initialStock,
      warehouse,
      fetchFromAPI // Flag to fetch from Open Food Facts
    } = req.body;

    let productData = {
      name,
      sku,
      category,
      unitOfMeasure,
      barcode: barcode || sku,
      createdBy: req.user.id
    };

    // If barcode provided and fetchFromAPI is true, enrich with API data
    if (barcode && fetchFromAPI) {
      try {
        const apiData = await openFoodFactsService.getProductByBarcode(barcode);
        if (apiData.found) {
          productData = {
            ...productData,
            name: name || apiData.name,
            category: category || apiData.category,
            unitOfMeasure: unitOfMeasure || apiData.unitOfMeasure,
            description: apiData.description,
            brand: apiData.brand,
            imageUrl: apiData.imageUrl,
            weight: apiData.weight,
            additionalInfo: apiData.additionalInfo
          };
        }
      } catch (apiError) {
        console.warn('Failed to fetch from Open Food Facts, continuing with manual data:', apiError.message);
      }
    }

    // Create product
    const product = await Product.create(productData);

    // If initial stock provided, create a stock entry
    if (initialStock && warehouse) {
      const receipt = await Receipt.create({
        supplier: 'Initial Stock',
        warehouse: warehouse,
        products: [{
          product: product._id,
          quantity: initialStock
        }],
        status: 'done',
        createdBy: req.user.id,
        validatedAt: new Date()
      });

      product.stockLocations = [{
        warehouse: warehouse,
        quantity: initialStock
      }];
      await product.save();
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: product
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message
    });
  }
};

/**
 * Search products using Open Food Facts
 * @route GET /api/products/search-external
 */
export const searchExternalProducts = async (req, res) => {
  try {
    const { query, page = 1 } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const results = await openFoodFactsService.searchProducts(query, page);

    res.status(200).json({
      success: true,
      count: results.length,
      products: results
    });

  } catch (error) {
    console.error('External search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search external products',
      error: error.message
    });
  }
};

/**
 * Get all products with filters
 * @route GET /api/products
 */
export const getAllProducts = async (req, res) => {
  try {
    const { category, warehouse, search, lowStock } = req.query;
    
    let filter = {};
    
    if (category) filter.category = category;
    if (warehouse) filter['stockLocations.warehouse'] = warehouse;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter)
      .populate('stockLocations.warehouse', 'name')
      .sort({ createdAt: -1 });

    // Filter low stock items if requested
    let filteredProducts = products;
    if (lowStock === 'true') {
      filteredProducts = products.filter(product => {
        const totalStock = product.stockLocations.reduce((sum, loc) => sum + loc.quantity, 0);
        return totalStock < (product.reorderLevel || 10);
      });
    }

    res.status(200).json({
      success: true,
      count: filteredProducts.length,
      products: filteredProducts
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
};

/**
 * Get single product by ID
 * @route GET /api/products/:id
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('stockLocations.warehouse', 'name location');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      product: product
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
};

/**
 * Update product
 * @route PUT /api/products/:id
 */
export const updateProduct = async (req, res) => {
  try {
    const updates = req.body;
    
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: product
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};

/**
 * Delete product
 * @route DELETE /api/products/:id
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if product has stock
    const totalStock = product.stockLocations.reduce((sum, loc) => sum + loc.quantity, 0);
    if (totalStock > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete product with existing stock. Please adjust stock to zero first.'
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete product',
      error: error.message
    });
  }
};