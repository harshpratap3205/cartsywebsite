const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Get all users (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// Get all orders (Admin)
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort('-createdAt');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// Delete user (Admin)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new ApiError(404, 'User not found'));
    await user.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, getAllOrders, deleteUser };