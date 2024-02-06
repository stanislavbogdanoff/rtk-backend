const jwt = require("jsonwebtoken");

const protect = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, "abc123");
  }
};
