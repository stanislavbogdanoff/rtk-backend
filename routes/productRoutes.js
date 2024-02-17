const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createProduct,
  getProducts,
  updateProduct,
} = require("../controllers/productController");
const router = express.Router();

router.post("/products", protect, createProduct);
router.get("/products", getProducts);
router.patch("/products/:productId", protect, updateProduct);

module.exports = router;
