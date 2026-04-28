const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');
const validate = require('../middleware/validationMiddleware');
const { productSchema } = require('../validations/productValidation');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

router.route('/')
  .get(getProducts)
  .post(protect, admin, upload.array('images', 5), validate(productSchema), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, upload.array('images', 5), updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;