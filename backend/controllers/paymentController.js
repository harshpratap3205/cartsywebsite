const razorpayInstance = require('../config/razorpay');
const Order = require('../models/Order');
const ApiError = require('../utils/apiError');
const crypto = require('crypto');

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
const createRazorpayOrder = async (req, res, next) => {
  console.log('🔵 [1] createRazorpayOrder called');
  console.log('🔵 [2] Request body:', req.body);
  console.log('🔵 [3] Auth user ID:', req.user?._id);

  try {
    const { orderId } = req.body;
    console.log('🔵 [4] Extracted orderId:', orderId);

    if (!orderId) {
      console.log('🔴 [5] orderId missing');
      return next(new ApiError(400, 'Order ID is required'));
    }

    console.log('🔵 [6] Querying Order.findById...');
    const order = await Order.findById(orderId);
    console.log('🔵 [7] Order found?', !!order);
    if (order) {
      console.log('🔵 [8] Order user ID:', order.user.toString());
      console.log('🔵 [9] Order totalAmount:', order.totalAmount);
    }

    if (!order) {
      console.log('🔴 [10] Order not found -> 404');
      return next(new ApiError(404, 'Order not found'));
    }

    console.log('🔵 [11] Comparing user IDs...');
    if (order.user.toString() !== req.user._id.toString()) {
      console.log('🔴 [12] Authorization failed -> 403');
      return next(new ApiError(403, 'Not authorized'));
    }

    console.log('🔵 [13] Preparing Razorpay options...');
    const options = {
      amount: order.totalAmount * 100, // paise
      currency: 'INR',
      receipt: `receipt_${orderId}`,
      payment_capture: 1,
    };
    console.log('🔵 [14] Razorpay options:', options);

    console.log('🔵 [15] Calling razorpayInstance.orders.create...');
    const razorpayOrder = await razorpayInstance.orders.create(options);
    console.log('🔵 [16] Razorpay order created:', razorpayOrder.id);

    order.paymentResult = { id: razorpayOrder.id, status: 'created' };
    await order.save();
    console.log('🟢 [17] Order updated with paymentResult');

    const response = {
      razorpayOrderId: razorpayOrder.id,
      amount: order.totalAmount,
      orderId: order._id,
    };
    console.log('🟢 [18] Sending response:', response);
    res.json(response);

  } catch (error) {
    console.error('❌ [ERROR] createRazorpayOrder caught:', error);
    console.error('❌ Error details:', error.response?.data || error.message);
    next(error);
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify
const verifyPayment = async (req, res, next) => {
  console.log('🟣 [1] verifyPayment called');
  console.log('🟣 [2] Request body:', req.body);

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    console.log('🟣 [3] Extracted params:', { razorpay_order_id, razorpay_payment_id, orderId });

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    console.log('🟣 [4] Body for HMAC:', body);

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');
    console.log('🟣 [5] Expected signature:', expectedSignature);
    console.log('🟣 [6] Received signature:', razorpay_signature);

    if (expectedSignature !== razorpay_signature) {
      console.log('🔴 [7] Signature mismatch -> 400');
      return next(new ApiError(400, 'Invalid payment signature'));
    }

    console.log('🟣 [8] Looking up order by ID:', orderId);
    const order = await Order.findById(orderId);
    if (!order) {
      console.log('🔴 [9] Order not found -> 404');
      return next(new ApiError(404, 'Order not found'));
    }

    console.log('🟣 [10] Updating order paymentResult and status');
    order.paymentResult = {
      id: razorpay_payment_id,
      status: 'paid',
      update_time: new Date().toISOString(),
      email_address: req.user.email,
    };
    order.paidAt = Date.now();
    order.status = 'Processing';
    await order.save();

    console.log('🟢 [11] Payment verified and order saved');
    res.json({ success: true, message: 'Payment verified', orderId: order._id });

  } catch (error) {
    console.error('❌ [ERROR] verifyPayment caught:', error);
    next(error);
  }
};

module.exports = { createRazorpayOrder, verifyPayment };