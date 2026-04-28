const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createOrder, getMyOrders, getOrderById, updateOrderStatus } = require('../controllers/orderController');
const validate = require('../middleware/validationMiddleware');
const { orderSchema } = require('../validations/orderValidation');

router.use(protect);
router.route('/').post(validate(orderSchema), createOrder);
router.get('/myorders', getMyOrders);
router.route('/:id').get(getOrderById);
router.put('/:id/status', updateOrderStatus); // admin only? we'll add admin check in controller

module.exports = router;