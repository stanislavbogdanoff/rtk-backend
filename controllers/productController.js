const { Product } = require("../models/userSchema");

const createProduct = async (req, res) => {
  const product = await Produc.create(req.body);
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
