const { User } = require("../models/userSchema");

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
};
