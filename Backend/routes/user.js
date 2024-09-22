const express = require("express");
const router = express.Router();
const User = require('../models/user');
const Question = require('../models/question');
const { getSignedUrlForObject } = require('../utils/amazonS3');

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


router.get("/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username }).select('-password -two_factor_secret');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const profilePictureUrl = await getSignedUrlForObject(user.profile_pic);
    const bannerPictureUrl = await getSignedUrlForObject(user.banner_pic);

        const userProfile = {
      profilePicture: profilePictureUrl,
      bannerPicture: bannerPictureUrl,
      name: `${user.first_name} ${user.last_name}`,
      username: user.username,
      followers: user.followers.length,
      profileLikes: user.profile_likes.length,
      totalPostUpvotes: user.total_post_upvotes,
      gender: user.gender,
      bio: user.bio,
      linkedin: user.linkedin,
      instagram: user.instagram,
      github: user.github
    };

        console.log('Sending user profile:', userProfile);
    res.json(userProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: "Error fetching user profile", error: error.message });
  }
});

router.post("/:username/like", async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const likerId = req.user.id;

        const likeIndex = user.profile_likes.indexOf(likerId);
        if (likeIndex > -1) {
            user.profile_likes.splice(likeIndex, 1);
        } else {
            user.profile_likes.push(likerId);
        }

        await user.save();

        res.json({ profileLikes: user.profile_likes.length, isLiked: likeIndex === -1 });
    } catch (error) {
        console.error('Error liking profile:', error);
        res.status(500).json({ message: "Error liking profile", error: error.message });
    }
});

router.post("/:username/follow", async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const followerId = req.user.id;

        const followerIndex = user.followers.indexOf(followerId);
        if (followerIndex > -1) {
            user.followers.splice(followerIndex, 1);
        } else {
            user.followers.push(followerId);
        }

        await user.save();

        res.json({ followers: user.followers.length, isFollowing: followerIndex === -1 });
    } catch (error) {
        console.error('Error following/unfollowing user:', error);
        res.status(500).json({ message: "Error following/unfollowing user", error: error.message });
    }
});


// Get all questions posted by a user
router.get("/:username/questions", async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const questions = await Question.find({ user_id: user._id })
            .sort({ created_at: -1 }) // Ensure the field name matches the schema
            .populate('user_id', 'username profile_pic')
            .populate('tags', 'name');

        res.json(questions);
    } catch (error) {
        console.error('Error fetching user questions:', error);
        res.status(500).json({ message: "Error fetching user questions", error: error.message });
    }
});

// Get top 5 most upvoted questions of a user
router.get("/:username/top-questions", async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const questions = await Question.find({ user_id: user._id })
            .sort({ upvotes: -1 })
            .limit(5)
            .populate('user_id', 'username profile_pic')
            .populate('tags', 'name');

        res.json(questions);
    } catch (error) {
        console.error('Error fetching top user questions:', error);
        res.status(500).json({ message: "Error fetching top user questions", error: error.message });
    }
});



module.exports = router;