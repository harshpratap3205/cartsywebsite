const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiError = require('../utils/apiError');

// @desc    Get user cart
// @route   GET /api/cart
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return next(new ApiError(404, 'Product not found'));
    if (product.stock < quantity) return next(new ApiError(400, 'Insufficient stock'));

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    await cart.save();
    await cart.populate('items.product');
    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    if (quantity < 1) return next(new ApiError(400, 'Quantity must be at least 1'));

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return next(new ApiError(404, 'Cart not found'));

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) return next(new ApiError(404, 'Item not in cart'));

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return next(new ApiError(404, 'Cart not found'));
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart };