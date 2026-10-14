const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const ApiError = require('../utils/apiError');

// Get all users (Admin)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort('-createdAt');
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

// Update user role (Admin / Superadmin)
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin', 'superadmin'].includes(role)) {
      return next(new ApiError(400, 'Invalid role. Must be user, admin, or superadmin.'));
    }

    const user = await User.findById(req.params.id);
    if (!user) return next(new ApiError(404, 'User not found'));

    user.role = role;
    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: `User role updated to ${role}`
    });
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

module.exports = { getAllUsers, getAllOrders, updateUserRole, deleteUser };