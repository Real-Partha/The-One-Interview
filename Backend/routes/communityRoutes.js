// communityRoutes.js
const express = require('express');
const router = express.Router();
const Community = require('../models/community');
const User = require('../models/user');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'You must be logged in to perform this action' });
};

// Get user's communities
router.get('/user', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('communities');
    res.json(user.communities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get top communities
router.get('/top', async (req, res) => {
  try {
    const topCommunities = await Community.find()
      .sort({ 'members.length': -1 })
      .limit(5);
    res.json(topCommunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search communities
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    const communities = await Community.find({ name: { $regex: query, $options: 'i' } }).limit(10);
    res.json(communities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new community
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const community = new Community({
      ...req.body,
      createdBy: req.user._id
    });
    await community.save();
    
    // Add the community to the user's communities
    const user = await User.findById(req.user._id);
    user.communities.push(community._id);
    await user.save();
    
    res.status(201).json(community);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Join a community
router.post('/:id/join', isAuthenticated, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }
    if (community.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'User already a member' });
    }
    community.members.push(req.user._id);
    await community.save();
    
    const user = await User.findById(req.user._id);
    user.communities.push(community._id);
    await user.save();
    
    res.json({ message: 'Joined community successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
