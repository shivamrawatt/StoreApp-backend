const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload'); // ✅ Cloudinary upload middleware

const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
} = require('../controllers/productController');

// GET all products
router.get('/', getProducts);

// CREATE product (with image)
router.post('/', upload.single('image'), createProduct);

// UPDATE product (optional new image)
router.put('/:id', upload.single('image'), updateProduct);

// DELETE product
router.delete('/:id', deleteProduct);

// UPDATE STOCK
router.patch('/:id/stock', updateStock);

module.exports = router;
