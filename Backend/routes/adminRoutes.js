const express = require("express");
const router = express.Router();
const Question = require("../models/question");

// Middleware to check if user is admin
// Use rotu field for role-based access control
const isAdmin = (req, res, next) => {
  console.log(req.user.rotu === "admin");
  if (req.isAuthenticated() && req.user.rotu === "admin") {
    return next();
  }
  res.status(403).json({ error: "Access denied" });
};

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
