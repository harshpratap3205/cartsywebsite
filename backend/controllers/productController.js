const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const ApiError = require('../utils/apiError');

// @desc    Create product (Admin)
// @route   POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock } = req.body;
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        const result = await cloudinary.uploader.upload(dataURI, { folder: 'ecommerce/products' });
        imageUrls.push(result.secure_url);
      }
    }
    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      images: imageUrls,
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products (with filtering, sorting, pagination)
// @route   GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const search = req.query.search;
    const sort = req.query.sort || '-createdAt'; // default newest first

    let filter = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit);
    const total = await Product.countDocuments(filter);
    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ApiError(404, 'Product not found'));
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ApiError(404, 'Product not found'));
    const { name, description, price, category, stock } = req.body;
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    // Handle new images if any
    if (req.files && req.files.length > 0) {
      const newImageUrls = [];
      for (const file of req.files) {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        const result = await cloudinary.uploader.upload(dataURI, { folder: 'ecommerce/products' });
        newImageUrls.push(result.secure_url);
      }
      product.images = newImageUrls;
    }
    await product.save();
    res.json(product);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return next(new ApiError(404, 'Product not found'));
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct };