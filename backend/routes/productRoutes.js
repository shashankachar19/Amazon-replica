// backend/routes/productRoutes.js
let express;
try {
  express = require('express');
} catch (error) {
  console.error('Failed to load express:', error.message);
  throw error;
}
const router = express.Router();

// Lazy loading with error handling for Product model
let Product;
try {
  Product = require('../models/Product');
} catch (error) {
  console.error('Failed to load Product model:', error.message);
} 

// @route   GET /api/products
// @desc    Fetch all products
// @access  Public (for now)
router.get('/', async (req, res) => {
  try {
    // Fetches all products from the database
    const products = await Product.findAll();
    console.log(`Successfully fetched ${products.length} products`);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error.message, error.stack);
    res.status(500).json({ message: 'Server Error: Could not fetch products' });
  }
});

module.exports = router;