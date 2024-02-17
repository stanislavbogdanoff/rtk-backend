const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  password: String,
  age: Number,
  jobTitle: String,
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
