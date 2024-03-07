const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createProduct,
  getProducts,
  updateProduct,
  searchProducts,
  deleteProduct,
  getProductDetails,
  editProduct,
} = require("../controllers/productController");
const upload = require("../multer");
const router = express.Router();

router.post("/", protect, upload.single("image"), createProduct);
router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/:productId", protect, getProductDetails);
router.patch("/:productId", protect, editProduct);
router.patch("/:productId", protect, upload.single("image"), updateProduct);
router.delete("/:productId", protect, deleteProduct);

module.exports = router;
