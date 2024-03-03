const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  password: String,
  age: Number,
  jobTitle: String,
  role: {
    type: String,
    default: "user",
  },
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      amount: Number,
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],

  // "admin", "user"
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
