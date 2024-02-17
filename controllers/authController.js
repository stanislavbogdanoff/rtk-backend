const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/userSchema");

const generateToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const login = async (req, res) => {
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
};

const register = async (req, res) => {
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
};

module.exports = { login, register };
