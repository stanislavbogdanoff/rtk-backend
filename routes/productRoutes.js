const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createProduct,
  getProducts,
  updateProduct,
} = require("../controllers/productController");
const upload = require("../multer");
const router = express.Router();

router.post("/", protect, upload.single("image"), createProduct);
router.get("/", getProducts);
router.patch("/:productId", protect, updateProduct);

module.exports = router;
