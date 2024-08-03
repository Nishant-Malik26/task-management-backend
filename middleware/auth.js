const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (req, res, next) => {
  console.log("🚀 ~ authenticate ~ req:", req);
  const token = req?.cookies?.token;
  // middleware for checking if user is logged in
  if (!token) {
    return res.status(400).json([{ msg: "Token is not present" }]);
  } else {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      console.log("🚀 ~ authenticate ~ decoded:", decoded);
      req.user = decoded.user;
      next();
    } catch (error) {
      res.status(401).json([{ msg: "Token not Valid" }]);
      console.log(error);
    }
  }
};

module.exports = authenticate;
