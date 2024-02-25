const express = require("express");
const app = express();
const path = require("path");

const cors = require("cors");
corsOptions = {
  origin: "http://localhost:5173",
};
app.use(cors(corsOptions));

const dotenv = require("dotenv");
dotenv.config();

const { connectDb } = require("./db/connectDb");

app.use(express.json());

connectDb();

const port = process.env.PORT;

app.use("/uploads", express.static(path.join(__dirname, "./uploads")));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

// routes

app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/products", require("./routes/productRoutes"));
app.use("/orders", require("./routes/orderRoutes"));

app.listen(port, () => console.log(`Server ${port} is running`));
