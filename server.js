const express = require("express");
const app = express();

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

// routes

app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/products", require("./routes/productRoutes"));
app.use("/orders", require("./routes/orderRoutes"));

app.listen(port, () => console.log(`Server ${port} is running`));
