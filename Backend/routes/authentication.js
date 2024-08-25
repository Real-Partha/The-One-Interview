const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/user");
const Activity = require("../models/activity");
const { getSignedUrlForObject } = require("../utils/amazonS3");
const { uploadObject } = require("../utils/amazonS3");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const sharp = require("sharp");

// OneID Signup
// Local Signup
router.post("/signup", async (req, res) => {
  try {
    const {
      username,
      first_name,
      last_name,
      email,
      password,
      gender,
      date_of_birth,
    } = req.body;
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
      type: "oneid",
      role: "user",
      gender,
      date_of_birth,
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

router.get("/status", async (req, res) => {
  if (req.isAuthenticated()) {
    req.user = req.user.toObject();
    delete req.user.password;
    const profilePicUrl = await getSignedUrlForObject(req.user.profile_pic);
    req.user.profile_pic = profilePicUrl;
    res.json({
      isAuthenticated: true,
      user: req.user,
    });
  } else {
    res.json({ isAuthenticated: false });
  }
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error logging out", error: err.message });
    }
    req.session.destroy((err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error destroying session", error: err.message });
      }
      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logout successful" });
    });
  });
});

router.get("/check-username/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const existingUser = await User.findOne({ username });
    res.json({ available: !existingUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error checking username", error: error.message });
  }
});

router.get("/check-email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const existingUser = await User.findOne({ email });
    res.json({ exists: !!existingUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error checking email", error: error.message });
  }
});

router.get("/user-activities", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const activities = await Activity.find({ user_id: req.user._id })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const totalActivities = await Activity.countDocuments({ user_id: req.user._id });
    const hasMore = totalActivities > page * limit;

    res.json({ activities, hasMore });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user activities", error: error.message });
  }
});

router.patch(
  "/update-profile",
  upload.single("profile_pic"),
  async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const updates = req.body;
      const oldUser = await User.findById(req.user._id);

      // Handle profile picture update
      if (req.file) {
        let buffer = req.file.buffer;
        const maxSizeInBytes = 500 * 1024; // 500KB

        // Check if the image size is over 500KB
        if (buffer.length > maxSizeInBytes) {
          // Reduce the image size
          buffer = await sharp(buffer)
            .resize({ width: 800, height: 800, fit: "inside" })
            .toBuffer();

          // If it's still over 500KB, reduce quality
          if (buffer.length > maxSizeInBytes) {
            buffer = await sharp(buffer).png({ quality: 80 }).toBuffer();
          }
        }

        console.log("Buffer length:", (buffer.length / 1024).toFixed(2), "KB");
        const filename = `${req.user._id}_${Date.now()}_${
          req.file.originalname
        }`;
        await uploadObject(filename, buffer);
        updates.profile_pic = filename;

        // Record profile photo update activity
        await Activity.create({
          user_id: req.user._id,
          type: "profile_photo",
          action: "updated"
        });
      }

      // Handle username update
      if (updates.username && updates.username !== oldUser.username) {
        await Activity.create({
          user_id: req.user._id,
          type: "username",
          details: { old: oldUser.username, new: updates.username },
        });
      }

      const user = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
      });

      // Record other profile updates
      const changedFields = Object.keys(updates).filter(
        (key) =>
          updates[key] !== oldUser[key] &&
          key !== "username" &&
          key !== "profile_pic"
      );

      if (changedFields.length > 0) {
        await Activity.create({
          user_id: req.user._id,
          type: "profile_update",
          details: changedFields.reduce((acc, field) => {
            acc[field] = { old: oldUser[field], new: updates[field] };
            return acc;
          }, {}),
        });
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updatedUser = user.toObject();
      delete updatedUser.password;

      res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating profile", error: error.message });
    }
  }
);

router.patch("/delete-profile-picture", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profile_pic: "user.png" },
      { new: true }
    );

    // Record activity
    await Activity.create({
      user_id: req.user._id,
      type: "profile_photo",
      action: "deleted",
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.json({
      message: "Profile picture deleted successfully",
      user: updatedUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error deleting profile picture",
        error: error.message,
      });
  }
});

router.post("/change-password", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Record password change activity
    await Activity.create({
      user_id: req.user._id,
      type: "password",
      action: "changed",
    });

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error changing password", error: error.message });
  }
});

//route to check if password is set for user or not, dont send passowrd back to client, only send if password is set or not
router.get("/has-password", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ hasPassword: !!user.password });
  } catch (error) {
    res.status(500).json({ message: "Error checking password", error: error.message });
  }
});

module.exports = router;
