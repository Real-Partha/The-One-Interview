// communityRoutes.js
const express = require("express");
const router = express.Router();
const Community = require("../models/community");
const User = require("../models/user");
const multer = require("multer");
const { uploadObject, deleteObject } = require("../utils/amazonS3");

const upload = multer({ storage: multer.memoryStorage() });

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res
    .status(401)
    .json({ message: "You must be logged in to perform this action" });
};

// Get user's communities
router.get("/user", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("communities");
    res.json(user.communities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get top communities
router.get("/top", async (req, res) => {
  try {
    const topCommunities = await Community.find()
      .sort({ "members.length": -1 })
      .limit(5);
    res.json(topCommunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search communities
router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    const communities = await Community.find({
      name: { $regex: query, $options: "i" },
    }).limit(10);
    res.json(communities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new community
router.post(
  "/",
  isAuthenticated,
  upload.fields([
    { name: "profilePhoto", maxCount: 1 },
    { name: "bannerPhoto", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { name, nickname, description, lookingFor, rules } = req.body;

      let profilePhotoKey, bannerPhotoKey;

      if (req.files["profilePhoto"]) {
        const file = req.files["profilePhoto"][0];
        profilePhotoKey = `community_profile_${Date.now()}_${
          file.originalname
        }`;
        await uploadObject(profilePhotoKey, file.buffer);
      }

      if (req.files["bannerPhoto"]) {
        const file = req.files["bannerPhoto"][0];
        bannerPhotoKey = `community_banner_${Date.now()}_${file.originalname}`;
        await uploadObject(bannerPhotoKey, file.buffer);
      }

      const community = new Community({
        name,
        nickname,
        description,
        lookingFor: lookingFor.split(",").map((item) => item.trim()),
        rules,
        profilePhoto: profilePhotoKey || "com_prof.jpg",
        bannerPhoto: bannerPhotoKey || "com_banner.jpg",
        members: [req.user._id],
        createdBy: req.user._id,
      });

      await community.save();

      // Add the community to the user's communities
      const user = await User.findById(req.user._id);
      user.communities.push(community._id);
      await user.save();

      res.status(201).json(community);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }
);

// Join a community
router.post("/:id/join", isAuthenticated, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    if (community.members.includes(req.user._id)) {
      return res.status(400).json({ message: "User already a member" });
    }
    community.members.push(req.user._id);
    await community.save();

    const user = await User.findById(req.user._id);
    user.communities.push(community._id);
    await user.save();

    res.json({ message: "Joined community successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/search", async (req, res) => {
  try {
    const { query } = req.query;
    const communities = await Community.find(
      { name: { $regex: query, $options: "i" } },
      "name description members"
    ).limit(10);
    res.json(communities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/check-nickname/:nickname", async (req, res) => {
  try {
    const { nickname } = req.params;
    const existingCommunity = await Community.findOne({ nickname });
    res.json({ available: !existingCommunity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
