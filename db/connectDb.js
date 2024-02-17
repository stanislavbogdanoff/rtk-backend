const mongoose = require("mongoose");

const connectDb = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"));
};

module.exports = { connectDb };
