const express = require("express");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwttoken = require("jsonwebtoken");
const router = express.Router();

// Middleware to set cookie options
const cookieOptions = {
  httpOnly: true, // Prevents JavaScript from accessing the cookie
  secure: process.env.NODE_ENV === "production", // Use secure cookies in production
  maxAge: 3600000, // 1 hour
};

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(400).json({ msg: "User Not Found" });
    } else return res.status(200).json({ user });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.post(
  "/",
  [
    // Uncomment and use if you want to require a name
    // check("name", "Name is required").not().isEmpty(),
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
      const { password, email } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User Doesn't Exist" }] });
      }

      const isPassCorrect = await bcrypt.compare(password, user.password);

      if (isPassCorrect) {
        const payload = {
          user: {
            id: user.id,
            name: user.name,
          },
        };

        // Create the JWT token
        const token = jwttoken.sign(payload, "itsasecret", { expiresIn: "1h" });
        console.log("🚀 ~ token:", "reached ");

        // Set the cookie
        // res.cookie('token', token, cookieOptions);
        res.cookie("token", token, {
          httpOnly: true,
          //   secure: true,
        });

        res.status(200).json({ msg: "User Successfully logged in" });
      } else {
        res.status(400).json({ errors: [{ msg: "Incorrect Credentials" }] });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ errors: [{ msg: "Server Error" }] });
    }
  }
);

module.exports = router;
