const express = require("express");
const router = express.Router();
const Activity = require("../models/activity");
const { uploadObject, deleteObject } = require("../utils/amazonS3");
const sharp = require("sharp");
const OTP = require("../models/otp");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { google } = require("googleapis");
const fs = require("fs").promises;
const path = require("path");
const nodemailer = require("nodemailer");
const { profile } = require("console");
const { authenticator } = require("otplib");
const qrcode = require("qrcode");

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  try {
    const oauth2Client = new OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );
    oauth2Client.setCredentials({
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    });
    const accessToken = await oauth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_ADDRESS,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    return transporter;
  } catch (error) {
    console.error("Error creating transporter:", error);
    throw error;
  }
};

// Use this function to send emails
const sendEmail = async (to, subject, templateName, replacements) => {
  try {
    const transporter = await createTransporter();
    const templatePath = path.join(__dirname, "..", "templates", templateName);
    let htmlContent = await fs.readFile(templatePath, "utf-8");

    // Replace placeholders in the template
    for (const [key, value] of Object.entries(replacements)) {
      htmlContent = htmlContent.replace(new RegExp(`{{${key}}}`, "g"), value);
    }

    const result = await transporter.sendMail({
      from: {
        name: "The One Interview",
        address: process.env.EMAIL_ADDRESS,
      },
      to,
      subject,
      html: htmlContent,
    });
    console.log("Email sent successfully");
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
router.get("/user-activities", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  if (req.query.page != 1) {
  await new Promise(resolve => setTimeout(resolve, 1500));
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const activities = await Activity.find({ user_id: req.user._id })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const totalActivities = await Activity.countDocuments({
      user_id: req.user._id,
    });
    const hasMore = totalActivities > page * limit;

    res.json({ activities, hasMore });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user activities",
      error: error.message,
    });
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
          action: "updated",
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
    const curruser = await User.findById(req.user._id);
    if (curruser) {
      const profile_pic = curruser.profile_pic;
      console.log(profile_pic);
      deleteObject(profile_pic)
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
        });
    }

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
    res.status(500).json({
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
    res
      .status(500)
      .json({ message: "Error changing password", error: error.message });
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
    res
      .status(500)
      .json({ message: "Error checking password", error: error.message });
  }
});

router.post("/set-password", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const { newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Record password set activity
    await Activity.create({
      user_id: req.user._id,
      type: "password",
      action: "set",
    });

    res.json({ message: "Password set successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error setting password", error: error.message });
  }
});

router.post("/change-email", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const { newEmail } = req.body;

    // Check if the new email already exists in the database
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Store OTP in the database with expiry (5 minutes)
    await OTP.create({
      email: newEmail,
      otp: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
    });

    // Send OTP to new email
    await sendEmail(
      newEmail,
      "Email Change Verification",
      "otp-email-template.html",
      { OTP: otp }
    );
    res.json({ message: "OTP sent to new email" });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error.message });
  }
});

router.post("/verify-email-otp", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const { otp, newEmail } = req.body;

    // Find the OTP in the database
    const storedOtp = await OTP.findOne({
      email: newEmail,
      otp: otp,
      expiresAt: { $gt: new Date() },
    });

    if (!storedOtp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Update user's email
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { email: newEmail },
      { new: true }
    );

    // Send confirmation email to old email
    await sendEmail(
      req.user.email,
      "Email Change Confirmation",
      "email-change-notification-template.html",
      { NEW_EMAIL: newEmail }
    );

    // Delete the used OTP
    await OTP.deleteOne({ _id: storedOtp._id });

    // Record email change activity
    await Activity.create({
      user_id: req.user._id,
      type: "email",
      action: "changed",
      details: { old: req.user.email, new: newEmail },
    });

    res.json({ message: "Email changed successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
});

// Route to enable 2FA
router.post("/enable-2fa", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const secret = authenticator.generateSecret();
    const user = await User.findById(req.user._id);
    user.two_factor_secret = secret;
    await user.save();

    const otpauth_url = authenticator.keyuri(
      user.email,
      "The One Interview",
      secret
    );
    const qr_code = await qrcode.toDataURL(otpauth_url);

    res.json({ secret, qr_code });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error enabling 2FA", error: error.message });
  }
});

//verify-2fa route
router.post("/verify-2fa", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const { token } = req.body;
    const user = await User.findById(req.user._id);

    const cleanToken = token.toString().trim();
    console.log("Clean token:", cleanToken);

    const verified = authenticator.verify({
      token: cleanToken,
      secret: user.two_factor_secret,
    });

    console.log("Verified:", verified);

    if (verified) {

      // Record 2FA enabled activity
      
      user.two_factor_auth = true;
      await user.save();

      await Activity.create({
        user_id: req.user._id,
        type: "2fa",
        action: "enabled",
      });

      res.json({ message: "2FA enabled successfully" });
    } else {
      res.status(400).json({ message: "Invalid token" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying 2FA", error: error.message });
  }
});

// Route to disable 2FA
router.post("/disable-2fa", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const user = await User.findById(req.user._id);
    user.two_factor_auth = false;
    user.two_factor_secret = undefined;
    await user.save();

    // Record 2FA disabled activity
    await Activity.create({
      user_id: req.user._id,
      type: "2fa",
      action: "disabled",
    });

    res.json({ message: "2FA disabled successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error disabling 2FA", error: error.message });
  }
});

module.exports = router;
