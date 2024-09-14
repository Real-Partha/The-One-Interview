// routes/tags.js
const express = require('express');
const router = express.Router();
const Question = require('../models/question');

// Get all tags with their counts
router.get('/', async (req, res) => {
  try {
    const tags = await Question.aggregate([
      { $match: { status: 'approved' } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $project: { _id: 0, name: '$_id', count: 1 } },
      { $sort: { count: -1 } }
    ]);
    res.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ message: 'Error fetching tags' });
  }
});

// Get questions by tag
router.get('/questions/:tag', async (req, res) => {
  try {
    const tag = req.params.tag;
    const questions = await Question.find({ tags: tag, status: 'approved' })
      .select('question upvotes commentscount')
      .sort({ upvotes: -1 });
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions by tag:', error);
    res.status(500).json({ message: 'Error fetching questions by tag' });
  }
});

module.exports = router;
