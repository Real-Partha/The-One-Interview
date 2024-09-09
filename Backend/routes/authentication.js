const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const OTP = require("../models/otp");
const crypto = require("crypto");
const passport = require("passport");
const User = require("../models/user");
const PendingUser = require("../models/PendingUser");
const { getSignedUrlForObject } = require("../utils/amazonS3");
const { authenticator } = require("otplib");
const { sendEmail } = require("../routes/account"); // Import sendEmail function

const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

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

    // Generate OTP
    const otp = generateOTP();
    const newOTP = new OTP({
      email,
      otp,
      type: "registration",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiration
    });
    await newOTP.save();

    // Send email with OTP
    await sendEmail(
      email,
      "New Registration Email Verification",
      "registration-otp-template.html",
      { OTP: otp }
    );

    // // Store user data in session for later use
    // req.session.pendingUser = {
    //   username,
    //   first_name,
    //   last_name,
    //   email,
    //   password,
    //   gender,
    //   date_of_birth,
    // };

    const pendingUser = new PendingUser({
      ...req.body,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes expiration
    });
    await pendingUser.save();

    res.json({ message: "OTP sent to your email for verification" , email: req.body.email });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error during signup", error: error.message });
  }
});

router.post("/verify-registration-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpRecord = await OTP.findOne({
      email,
      otp,
      type: "registration",
    });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (otpRecord.expiresAt < Date.now()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: "OTP expired" });
    }

    // OTP is valid, create the user
    // const userData = req.session.pendingUser;

    const pendingUser = await PendingUser.findOne({ email });
    if (!pendingUser || pendingUser.expiresAt < Date.now()) {
      return res.status(400).json({ message: "Registration session expired" });
    }
    const userData = pendingUser.toObject();

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = new User({
      ...userData,
      password: hashedPassword,
      type: "oneid",
      role: "user",
    });
    await newUser.save();

    // Delete OTP and pendingUser from session
    await OTP.deleteOne({ _id: otpRecord._id });
    // delete req.session.pendingUser;
    await PendingUser.deleteOne({ email });

    // Log the user in
    req.login(newUser, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error logging in after signup" });
      }
      const user = newUser.toObject();
      delete user.password;

       // Set the session cookie
       res.cookie("connect.sid", req.sessionID, {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        signed: true,
      });

      return res.json({ message: "Signup successful", user: user });
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
});

// Local Login
router.post("/login", async (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error during authentication", error: err.message });
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }

    if (user.two_factor_auth) {
      // If 2FA is enabled, don't log in yet, but send a flag indicating 2FA is required
      return res.json({
        message: "2FA required",
        requireTwoFactor: true,
        userId: user._id,
      });
    }

    // If 2FA is not enabled, proceed with normal login
    req.login(user, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error logging in", error: err.message });
      }
      user = user.toObject();
      delete user.password;
      if (user.two_factor_secret) {
        delete user.two_factor_secret;
      }

      res.cookie("connect.sid", req.sessionID, {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        signed: true,
      });

      return res.json({
        message: "Login successful",
        user,
        sessionRestored: req.session.sessionRestored,
      });
    });
  })(req, res, next);
});

router.post("/verify-2fa", async (req, res) => {
  const { userId, token } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const verified = authenticator.verify({
      token: token.toString().trim(),
      secret: user.two_factor_secret,
    });

    if (verified) {
      req.session.requireTwoFactor = false;
      req.session.user = user;
      req.login(user, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error logging in", error: err.message });
        }
        let userObj = user.toObject();
        delete userObj.password;
        if (userObj.two_factor_secret) {
          delete userObj.two_factor_secret;
        }
        res.cookie("connect.sid", req.sessionID, {
          maxAge: 1000 * 60 * 60 * 24, // 1 day
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          signed: true,
        });
        return res.json({
          message: "Login successful",
          user: userObj,
          sessionRestored: req.session.sessionRestored,
        });
      });
    } else {
      res.status(400).json({ message: "Invalid 2FA token" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying 2FA", error: error.message });
  }
});

// Google Auth
router.get("/google", passport.authenticate("google"));

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    if (req.user.two_factor_auth) {
      // If 2FA is enabled, set a session flag and redirect to the login page
      req.session.requireTwoFactor = true;
      req.session.userId = req.user._id;
      res.redirect(`${process.env.CLIENT_URL}/login`);
    } else {
      // If 2FA is not enabled, complete the login process
      req.session.user = req.user;
      res.cookie("connect.sid", req.sessionID, {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        signed: true,
      });
      res.redirect(process.env.CLIENT_URL);
    }
  }
);

router.get("/status", async (req, res) => {
  if (req.isAuthenticated() && !req.session.requireTwoFactor) {
    req.user = req.user.toObject();
    delete req.user.password;
    delete req.user.two_factor_secret;
    delete req.user.rotu;
    const profilePicUrl = await getSignedUrlForObject(req.user.profile_pic);
    req.user.profile_pic = profilePicUrl;
    res.json({
      isAuthenticated: true,
      user: req.user,
    });
  } else if (req.session.requireTwoFactor) {
    res.json({
      isAuthenticated: false,
      requireTwoFactor: true,
      userId: req.session.userId,
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

const generateLongOTP = () => {
  return crypto.randomInt(10000000, 99999999).toString();
};

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const otp = generateLongOTP();
    const newOTP = new OTP({
      email,
      otp,
      type: "forgot_password",
    });
    await newOTP.save();

    // Send email with OTP
    await sendEmail(
      email,
      "Forgot Password OTP",
      "forgot-password-otp-template.html",
      { OTP: otp }
    );

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error sending OTP", error: error.message });
  }
});

router.post("/verify-forgot-password-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpRecord = await OTP.findOne({
      email,
      otp,
      type: "forgot_password",
    });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (otpRecord.expiresAt < Date.now()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: "OTP expired" });
    }
    res.json({ message: "OTP verified successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying OTP", error: error.message });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const otpRecord = await OTP.findOne({
      email,
      otp,
      type: "forgot_password",
    });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    if (otpRecord.expiresAt < Date.now()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: "OTP expired" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    await OTP.deleteOne({ _id: otpRecord._id });
    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error resetting password", error: error.message });
  }
});

module.exports = router;
