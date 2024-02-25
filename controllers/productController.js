const { Product } = require("../models/productSchema");
const fs = require("fs");

const createProduct = async (req, res) => {
  console.log(req.file);
  const imagePath = req.file.path;
  const product = await Product.create({
    ...req.body,
    image: imagePath,
    // numbers: JSON.parse(req.body.numbers),
  });
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
    const product = await Product.findById(productId);

    if (product && imagePath && product.image) {
      const oldImagePath = `./${product.image.split("\\").join("/")}`;
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      } else {
        console.log(`File does not exist: ${oldImagePath}`);
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

module.exports = { createProduct, getProducts, updateProduct };
