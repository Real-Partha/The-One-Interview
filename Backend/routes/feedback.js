// routes/feedback.js
const express = require('express');
const router = express.Router();
const Feedback = require('../models/feedback');

router.post('/', async (req, res) => {
  try {
    const newFeedback = new Feedback(req.body);
    await newFeedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    console.log('Error submitting feedback:', error);
    res.status(400).json({ error: 'Failed to submit feedback' });
  }
});



router.get('/', async (req, res) => {
  try {
    const feedbackData = await Feedback.find();
    res.json(feedbackData);
  } catch (error) {
    console.log('Error fetching feedback:', error);
    res.status(500).json({ error: 'Failed to fetch feedback data' });
  }
});

module.exports = router;
