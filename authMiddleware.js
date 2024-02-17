const jwt = require("jsonwebtoken");
const { User } = require("./userSchema");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization) {
    try {
      // "Bearer afqwjfad;lkv'aerfjqerjg'wqefjq'kegpoakef;woenr"

      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, "abc123");
      const user = await User.findById(decoded.id).select("-password");
      req.user = user;
      next();
    } catch (error) {
      res.status(401);
      throw new Error(error);
    }
  }
};

module.exports = { protect };
