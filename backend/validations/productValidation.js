const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).required(),
  price: Joi.number().positive().required(),
  category: Joi.string().required(),
  stock: Joi.number().integer().min(0).required(),
});

module.exports = { productSchema };