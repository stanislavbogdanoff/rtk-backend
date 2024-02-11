const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { User } = require("./userSchema");

corsOptions = {
  origin: "http://localhost:5173",
};

app.use(cors(corsOptions));

mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.gvrgdak.mongodb.net/users_db?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB connected"));

app.use(express.json());

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

app.post("/users", async (req, res) => {
  const userData = req.body;
  const user = await User.create(userData);
  res.status(201).json(user);
});

app.get("/users/search", async (req, res) => {
  const { searchString } = req.query;

  const users = await User.find({
    $or: [
      { name: new RegExp(searchString, "i") },
      { jobTitle: new RegExp(searchString, "i") },
    ],
  });

  res.status(200).json(users);
});

app.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  res.status(200).json(user);
});

app.patch("/users/:userId", async (req, res) => {
  const { userId } = req.params;

  const userData = req.body;

  const updatedUser = await User.findByIdAndUpdate(userId, userData, {
    new: true,
  });

  res.status(200).json(updatedUser);
});

app.delete("/users/:userId", async (req, res) => {
  const { userId } = req.params;

  const user = await User.findByIdAndDelete(userId);

  res.status(200).json(user);
});

app.listen(5000, () => console.log("Server 5000 is running"));
