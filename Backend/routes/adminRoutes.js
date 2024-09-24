const express = require("express");
require('dotenv').config();
const router = express.Router();
const Question = require("../models/question");
const AdminPasskey = require("../models/adminPasskey");
const User = require("../models/user");

// Middleware to check if user is admin
// Use rotu field for role-based access control
const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.rotu === "admin") {
    return next();
  }
  res.status(403).json({ error: "Access denied" });
};

router.get("/check-status", (req, res) => {
  const isAdmin = req.isAuthenticated() && req.user.rotu === "admin";
  res.json({ isAdmin });
});

router.post("/verify-passkey", isAdmin, async (req, res) => {
  try {
    const { passkey } = req.body;
    const adminPasskey = await AdminPasskey.findOne({ user_id: req.user._id });
    if (adminPasskey && adminPasskey.admin_passkey === passkey) {
      res.json({ verified: true });
    } else {
      res.json({ verified: false });
    }
  } catch (error) {
    console.error("Error verifying passkey:", error);
    res.status(500).json({ error: "Error verifying passkey" });
  }
});

//for manually adding admin
router.post(`/${process.env.ADD_ADMIN_ROUTE}`, async (req, res) => {
  try {
    const { username, passkey } = req.body;

    // Find the user by username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the user is already an admin
    if (user.rotu === "admin") {
      return res.status(400).json({ error: "User is already an admin" });
    }

    // Update user role to admin
    user.rotu = "admin";
    await user.save();

    // Create or update the admin passkey
    await AdminPasskey.findOneAndUpdate(
      { user_id: user._id },
      { admin_passkey: passkey },
      { upsert: true, new: true }
    );

    res.json({ message: "Admin added successfully" });
  } catch (error) {
    console.error("Error adding admin:", error);
    res.status(500).json({ error: "Error adding admin" });
  }
});

router.use(isAdmin);

router.patch("/approve-question/:id", async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: "Error approving question" });
  }
});

router.patch("/reject-question/:id", async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    res.json(question);
  } catch (error) {
    res.status(500).json({ error: "Error rejecting question" });
  }
});

module.exports = router;
