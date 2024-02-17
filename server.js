const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const { User } = require("./userSchema");
const { protect } = require("./authMiddleware");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Product } = require("./productSchema");

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

/* AUTHORIZATION START */

const generateToken = (id) => {
  return jwt.sign({ id: id }, "abc123", {
    expiresIn: "30d",
  });
};

app.post("/register", async (req, res) => {
  const { password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPwd = await bcrypt.hash(password, salt);
  const user = await User.create({ ...req.body, password: hashedPwd });

  res.status(200).json({
    name: user.name,
    age: user.age,
    jobTitle: user.jobTitle,
    password: user.password,
    token: generateToken(user._id),
  });
});

app.post("/login", async (req, res) => {
  const { name, password } = req.body;

  const user = await User.findOne({ name });

  console.log(user);

  if (user) {
    // User found, now check password
    if (await bcrypt.compare(password, user.password)) {
      // Passwords match, generate token and send response
      res.json({
        _id: user.id,
        name: user.name,
        age: user.age,
        password: user.password,
        token: generateToken(user._id),
      });
    } else {
      // Passwords don't match
      res.status(400).json({ error: "Неверный пароль!" });
    }
  } else {
    // User not found
    res.status(400).json({ error: `Пользователь с именем ${name} не найден` });
  }
});

/* AUTHORIZATION END */

app.get("/users", protect, async (req, res) => {
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

app.post("/orders", async (req, res) => {
  const ordersData = req.body;

  const productsIds = ordersData.orders.map((product) => {
    return product.productId;
  });

  // productsIds - массив айди по типу ["a234sdfz123xv", "qw1er234qwer"]

  const products = await Product.find({ _id: { $in: productsIds } });

  // products - массив двух товаров

  let sum = 0;

  // цикл в цикле - find внутри forEach

  products.forEach(
    (product) =>
      (sum +=
        product.price *
        ordersData.orders.find(
          (orderProduct) => orderProduct.productId == product._id
        ).amount)
  );

  await Promise.all(
    ordersData.orders.map((prod) => {
      return Product.findByIdAndUpdate(prod.productId, {
        $inc: { amount: -prod.amount },
      });
    })
  );

  const newOrder = await Order.create({
    deliveryType: ordersData.deliveryType,
    user: ordersData.user,
    orderSum: sum,
    orderProducts: productsIds,
  });

  res.status(201).json(newOrder);
});

app.post("/products", async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
});

app.patch("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json(product);
});

app.listen(5000, () => console.log("Server 5000 is running"));
