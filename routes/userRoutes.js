const Router = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers,
  addItemToCart,
  getItemsNumberInCart,
  getUserDetails,
  postGetUserProfile,
} = require("../controllers/userController");
const router = Router();

router.get("/", protect, getUsers);
router.get("/details", protect, getUserDetails);
router.get("/profile", protect, postGetUserProfile);
router.get("/search", searchUsers);
router.post("/", protect, createUser);
router.post("/cart", protect, addItemToCart);
router.get("/cart/amount", protect, getItemsNumberInCart);
router.get("/:userId", getUserById);
router.patch("/:userId", protect, updateUser);
router.delete("/:userId", protect, deleteUser);

module.exports = router;
