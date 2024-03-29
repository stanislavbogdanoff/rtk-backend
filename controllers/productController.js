const { Order } = require("../models/orderSchema");
const { Product } = require("../models/productSchema");
const fs = require("fs");

const createProduct = async (req, res) => {
  try {
    let imagePath;

    if (req.file && req.file.path) {
      console.log("image path => ", req.file.path);
      imagePath = req.file.path;
    }

    const newProductData = imagePath
      ? { ...req.body, image: imagePath }
      : req.body;

    const product = await Product.create(newProductData);

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: JSON.stringify(error) });
  }
};

const getProductDetails = async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);

  res.status(200).json(product);
};

const getProducts = async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
};

const searchProducts = async (req, res) => {
  const { searchString, page = 1, limit = 6 } = req.query;
  const count = await Product.countDocuments({
    $or: [
      { name: new RegExp(searchString, "i") },
      { description: new RegExp(searchString, "i") },
    ],
  });
  const products = await Product.find({
    $or: [
      { name: new RegExp(searchString, "i") },
      { description: new RegExp(searchString, "i") },
    ],
  })
    .limit(+limit)
    .skip((page - 1) * limit);
  res
    .status(200)
    .json({ data: products, totalPages: Math.ceil(count / limit) });
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

const editProduct = async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findByIdAndUpdate(productId, req.body, {
    new: true,
  });

  res.status(200).json(product);
};

const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findByIdAndDelete(productId);
  res.status(200).json(product);
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  searchProducts,
  deleteProduct,
  getProductDetails,
  editProduct,
};
