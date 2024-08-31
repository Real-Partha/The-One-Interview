const express = require('express');
const router = express.Router();
const Question = require('../models/question');

// Fetch all unique companies
router.get('/', async (req, res) => {
    try {
      const companies = await Question.aggregate([
        { $match: { companyName: { $exists: true, $ne: '' }, status: 'approved' } },
        { $group: {
          _id: '$companyName',
          questionCount: { $sum: 1 },
          lastUpdated: { $max: '$created_at' }
        }},
        { $project: {
          name: '$_id',
          questionCount: 1,
          lastUpdated: 1,
          _id: 0
        }},
        { $sort: { name: 1 } }
      ]);
  
      res.json(companies);
    } catch (error) {
      console.error('Error fetching companies:', error);
      res.status(500).json({ error: 'An error occurred while fetching companies' });
    }
  });

// Fetch questions for a specific company
router.get('/:companyName/questions', async (req, res) => {
  try {
    const { companyName } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const questions = await Question.find({ companyName, status: 'approved' })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalQuestions = await Question.countDocuments({ companyName, status: 'approved' });
    const totalPages = Math.ceil(totalQuestions / limit);

    res.json({
      questions,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    });
  } catch (error) {
    console.error('Error fetching company questions:', error);
    res.status(500).json({ error: 'An error occurred while fetching company questions' });
  }
});

module.exports = router;
