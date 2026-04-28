const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiError = require('../utils/apiError');

// @desc    Create new order (from cart)
// @route   POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress } = req.body;
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) return next(new ApiError(400, 'Cart is empty'));

    let totalAmount = 0;
    const orderItems = [];
    for (const item of cart.items) {
      const product = item.product;
      if (product.stock < item.quantity) {
        return next(new ApiError(400, `Insufficient stock for ${product.name}`));
      }
      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      });
      totalAmount += product.price * item.quantity;
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
    });

    // Decrease stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
    }
    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in user orders
// @route   GET /api/orders/myorders
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) return next(new ApiError(404, 'Order not found'));
    // Allow only admin or order owner
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return next(new ApiError(403, 'Not authorized'));
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return next(new ApiError(404, 'Order not found'));
    order.status = status;
    if (status === 'Delivered') order.deliveredAt = Date.now();
    await order.save();
    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderStatus };