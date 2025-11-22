// utils/openFoodFactsService.js
import axios from 'axios';

class OpenFoodFactsService {
  constructor() {
    this.baseURL = 'https://world.openfoodfacts.org/api/v0';
  }

  /**
   * Fetch product details by barcode
   * @param {string} barcode - Product barcode/EAN
   * @returns {Promise<Object>} Product information
   */
  async getProductByBarcode(barcode) {
    try {
      const response = await axios.get(
        `${this.baseURL}/product/${barcode}.json`,
        {
          timeout: 5000,
          headers: {
            'User-Agent': 'StockMaster-IMS/1.0'
          }
        }
      );

      if (response.data.status === 1) {
        return this.mapProductData(response.data.product);
      } else {
        return {
          found: false,
          message: 'Product not found in Open Food Facts database'
        };
      }
    } catch (error) {
      console.error('OpenFoodFacts API Error:', error.message);
      throw new Error('Failed to fetch product from Open Food Facts');
    }
  }

  /**
   * Map Open Food Facts data to StockMaster format
   * @param {Object} product - Raw product data from API
   * @returns {Object} Mapped product data
   */
  mapProductData(product) {
    return {
      found: true,
      name: product.product_name || product.product_name_en || 'Unknown Product',
      barcode: product.code,
      brand: product.brands || '',
      category: this.extractCategory(product),
      description: product.generic_name || '',
      unitOfMeasure: this.determineUnitOfMeasure(product),
      weight: product.quantity || '',
      imageUrl: product.image_url || product.image_front_url || '',
      ingredients: product.ingredients_text || '',
      allergens: product.allergens || '',
      nutritionGrade: product.nutrition_grades || '',
      additionalInfo: {
        countries: product.countries || '',
        stores: product.stores || '',
        labels: product.labels || '',
        packaging: product.packaging || ''
      }
    };
  }

  /**
   * Extract relevant category from Open Food Facts categories
   * @param {Object} product
   * @returns {string}
   */
  extractCategory(product) {
    if (product.categories_tags && product.categories_tags.length > 0) {
      // Get the most specific category (usually the last one)
      const category = product.categories_tags[product.categories_tags.length - 1];
      return category.replace('en:', '').replace(/-/g, ' ');
    }
    return product.categories || 'General';
  }

  /**
   * Determine appropriate unit of measure
   * @param {Object} product
   * @returns {string}
   */
  determineUnitOfMeasure(product) {
    const quantity = product.quantity || '';
    
    if (quantity.toLowerCase().includes('kg')) return 'kg';
    if (quantity.toLowerCase().includes('g')) return 'g';
    if (quantity.toLowerCase().includes('l')) return 'L';
    if (quantity.toLowerCase().includes('ml')) return 'ml';
    
    return 'unit'; // Default to units
  }

  /**
   * Search products by text query
   * @param {string} searchTerm
   * @param {number} page
   * @returns {Promise<Array>}
   */
  async searchProducts(searchTerm, page = 1) {
    try {
      const response = await axios.get(
        `${this.baseURL}/cgi/search.pl`,
        {
          params: {
            search_terms: searchTerm,
            page: page,
            page_size: 20,
            json: true
          },
          timeout: 5000
        }
      );

      if (response.data.products) {
        return response.data.products.map(product => this.mapProductData(product));
      }
      return [];
    } catch (error) {
      console.error('OpenFoodFacts Search Error:', error.message);
      throw new Error('Failed to search products');
    }
  }
}

export default new OpenFoodFactsService();