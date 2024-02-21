const { Product } = require("../models/productSchema");

const createProduct = async (req, res) => {
  const imagePath = req.file.path;
  const product = await Product.create({ ...req.body, image: imagePath });
  res.status(201).json(product);
};

const getProducts = async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json(product);
};

module.exports = { createProduct, getProducts, updateProduct };
