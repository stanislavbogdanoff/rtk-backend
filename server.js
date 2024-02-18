const express = require("express");
const app = express();
const multer = require("multer");
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

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
}).single("image");

app.post("/upload", (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).send({ message: "Error uploading image." });
    }
    res.status(201).send({
      message: "Image uploaded successfully.",
      filename: req.file.filename,
    });
  });
});

// routes

app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));
app.use("/products", require("./routes/productRoutes"));
app.use("/orders", require("./routes/orderRoutes"));

app.listen(port, () => console.log(`Server ${port} is running`));
