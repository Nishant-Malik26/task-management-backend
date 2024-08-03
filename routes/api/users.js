const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwttoken = require("jsonwebtoken");
const User = require("../../models/User");
const router = express.Router();

// Middleware to set cookie options
const cookieOptions = {
  httpOnly: true, // Prevents JavaScript from accessing the cookie
  //   secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
  maxAge: 3600000, // 1 hour
};

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is not in correct format").isEmail(),
    check("password", "Password length should be greater than 6").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, password, email } = req.body;
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User Already Exists" }] });
      }

      // Create a new user
      user = new User({
        name,
        password,
        email,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // Create the JWT payload
      const payload = {
        user: {
          id: user.id,
          name: user.name
        },
      };

      // Sign the token
      const token = jwttoken.sign(payload, "itsasecret", { expiresIn: "1h" });

      // Set the cookie
      res.cookie("token", token, cookieOptions);

      res.status(201).json({ msg: "User successfully registered" });
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
