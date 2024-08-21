const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("./models/user");
// OneID Signup
// Local Signup
router.post("/signup", async (req, res) => {
  try {
    const { username, first_name, last_name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      first_name,
      last_name,
      email,
      password: hashedPassword,
      type: "local",
      role: "user",
    });
    await newUser.save();
    req.login(newUser, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error logging in after signup" });
      }
      const user = newUser.toObject();
      delete user.password;
      return res.json({ message: "Signup successful", user: user });
    });
  } catch (error) {
    res.status(500).json({ message: "Error signing up", error: error.message });
  }
});

// Local Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error during authentication", error: err.message });
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.login(user, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error logging in", error: err.message });
      }
      user = user.toObject();
      delete user.password;
      return res.json({
        message: "Login successful",
        user,
        sessionRestored: req.session.sessionRestored,
      });
    });
  })(req, res, next);
});

// Google Auth
router.get("/google", passport.authenticate("google"));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect(process.env.CLIENT_URL);
  }
);

router.get("/user", (req, res) => {
  if (req.user) {
    req.user = req.user.toObject();
    delete req.user.password;
    res.json({ msg: "User is logged in", user: req.user });
  } else {
    res.status(401).json({ msg: "User is not logged in" });
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
