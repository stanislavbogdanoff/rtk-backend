const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers,
} = require("../controllers/userController");
const router = express.Router();

router.get("/users", searchUsers);
router.post("/users", protect, createUser);
router.get("/users", getUsers);
router.get("/users/:userId", getUserById);
router.patch("/users/:userId", protect, updateUser);
router.delete("/users/:userId", protect, deleteUser);

module.exports = router;
