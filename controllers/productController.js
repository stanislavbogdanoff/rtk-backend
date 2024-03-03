const { Product } = require("../models/productSchema");
const fs = require("fs");

const createProduct = async (req, res) => {
  console.log("image path => ", req.file.path);
  const imagePath = req.file.path;
  const product = await Product.create({
    ...req.body,
    image: imagePath,
  });
  res.status(201).json(product);
};

const getProducts = async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
};

const searchProducts = async (req, res) => {
  const { searchString } = req.query;
  const products = await Product.find({
    $or: [
      { name: new RegExp(searchString, "i") },
      { description: new RegExp(searchString, "i") },
    ],
  });
  res.status(200).json(products);
};

const updateProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const imagePath = req.file.path;
    const product = await Product.findById(productId);

    if (product && imagePath && product.image) {
      console.log("PRODUCT IMAGE => ", product.image);
      const oldImagePath = `./${product.image.split("\\").join("/")}`;
      console.log("OLD IMAGE PATH => ", oldImagePath);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      } else {
        // res.status(400).json({error: "some error"})
        console.error(`File does not exist: ${oldImagePath}`);
      }
    }

    const newProduct = imagePath ? { ...req.body, image: imagePath } : req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      newProduct,
      {
        new: true,
      }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      message: `Error updating product with id ${productId}`,
      error: error,
    });
  }
};

module.exports = { createProduct, getProducts, updateProduct, searchProducts };
