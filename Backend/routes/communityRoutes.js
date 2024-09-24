// communityRoutes.js
const express = require("express");
const router = express.Router();
const Community = require("../models/community");
const Question = require("../models/question");
const User = require("../models/user");
const multer = require("multer");
const {
  uploadObject,
  deleteObject,
  getSignedUrlForObject,
} = require("../utils/amazonS3");

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

router.get("/:nickname", async (req, res) => {
  try {
    const community = await Community.findOne({
      nickname: req.params.nickname,
    });
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }
    const profilePhotoUrl = await getSignedUrlForObject(community.profilePhoto);
    const bannerPhotoUrl = await getSignedUrlForObject(community.bannerPhoto);

    community.profilePhoto = profilePhotoUrl;
    community.bannerPhoto = bannerPhotoUrl;
    res.json(community);
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

router.get("/:nickname/top-questions", async (req, res) => {
  try {
    const community = await Community.findOne({
      nickname: req.params.nickname,
    });
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const topQuestions = await Question.find({ community: community._id })
      .sort({ upvotes: -1 })
      .limit(5)
      .select("question upvotes commentscount");

    res.json(topQuestions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Check membership status
router.get(
  "/:nickname/membership-status",
  isAuthenticated,
  async (req, res) => {
    try {
      const community = await Community.findOne({
        nickname: req.params.nickname,
      });
      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }

      const isMember = community.members.includes(req.user._id);
      res.json({ isMember });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

router.get("/:nickname/questions", async (req, res) => {
  try {
    const community = await Community.findOne({
      nickname: req.params.nickname,
    });
    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const questions = await Question.find({
      _id: { $in: community.posts },
      status: "approved",
    })
      .sort({ created_at: -1 })
      .populate("user_id", "username profile_pic");

    const questionsWithSignedUrls = await Promise.all(
      questions.map(async (question) => {
        const profilePicUrl = await getSignedUrlForObject(
          question.user_id.profile_pic
        );
        return {
          ...question.toObject(),
          user_id: {
            ...question.user_id.toObject(),
            profile_pic: profilePicUrl,
          },
        };
      })
    );

    res.json(questionsWithSignedUrls);
  } catch (error) {
    console.error("Error fetching community questions:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
