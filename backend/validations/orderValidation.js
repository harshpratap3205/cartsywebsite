const Joi = require('joi');

const addressSchema = Joi.object({
  street: Joi.string().required(),
  city: Joi.string().required(),
  state: Joi.string().required(),
  postalCode: Joi.string().required(),
  country: Joi.string().required(),
});

const orderSchema = Joi.object({
  shippingAddress: addressSchema.required(),
  paymentMethod: Joi.string().default('Razorpay'),
});

module.exports = { orderSchema };