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
  const { productId } = req.params;
  try {
    const imagePath = req.file.path;
    const newProduct = imagePath ? { ...req.body, image: imagePath } : req.body;
    const product = await Product.findByIdAndUpdate(productId, newProduct, {
      new: true,
    });
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({
        message: `Error updating product with id ${productId}`,
        error: error,
      });
  }
};

module.exports = { createProduct, getProducts, updateProduct };
