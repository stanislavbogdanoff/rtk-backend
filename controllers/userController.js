const { Order } = require("../models/orderSchema");
const { User } = require("../models/userSchema");

const addItemToCart = async (req, res) => {
  try {
    const reqUser = req.user;
    const { productId, amount } = req.body;
    const user = await User.findByIdAndUpdate(
      reqUser._id,
      {
        $push: { cart: { product: productId, amount: amount } },
      },
      { new: true }
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getItemsNumberInCart = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user)
    res.status(500).json({ message: `User with id ${req.user._id} not found` });

  res.status(200).json({ amount: user.cart.length });
};

const getUserDetails = async (req, res) => {
  const user = await User.findById(req.user._id).populate("cart.product");
  const orders = (await Order.find({ user: req.user._id })) || [];
  user.orders = orders;
  res.status(200).json(user);
};

const postGetUserProfile = async (req, res) => {
  const { userId } = req.params;

  const { reqUserId } = req.body;

  if (userId && reqUserId && userId !== reqUserId) {
    res.status(200).json({ message: "You don't have access to this profile" });
  }

  const user = await User.findById(userId);

  res.status(200).json(user);
};

const getUsers = async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
};

const createUser = async (req, res) => {
  const userData = req.body;
  const user = await User.create(userData);
  res.status(201).json(user);
};

const searchUsers = async (req, res) => {
  const { searchString } = req.query;

  console.log("req query => ", req.query);

  const users = await User.find({
    $or: [
      { name: new RegExp(searchString, "i") },
      { jobTitle: new RegExp(searchString, "i") },
    ],
  });

  res.status(200).json(users);
};

const getUserById = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  res.status(200).json(user);
};

const updateUser = async (req, res) => {
  const { userId } = req.params;

  const userData = req.body;

  const updatedUser = await User.findByIdAndUpdate(userId, userData, {
    new: true,
  });

  res.status(200).json(updatedUser);
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findByIdAndDelete(userId);

  res.status(200).json(user);
};

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  createUser,
  searchUsers,
  addItemToCart,
  getItemsNumberInCart,
  getUserDetails,
  postGetUserProfile,
};
