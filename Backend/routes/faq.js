// routes/faqRoutes.js
const express = require('express');
const router = express.Router();
const FAQ = require('../models/faq');

// Get all FAQs with role 'admin'
router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find({ role: 'admin' });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching FAQs' });
  }
});

// Submit a new question (for users)
router.post('/submit', async (req, res) => {
  try {
    const { question } = req.body;
    const newFAQ = new FAQ({ question, role: 'user' });
    await newFAQ.save();
    res.status(201).json({ message: 'Question submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting question' });
  }
});

// Get all FAQs with role 'user' (for admin panel)
router.get('/pending', async (req, res) => {
  try {
    const pendingFAQs = await FAQ.find({ role: 'user' });
    res.json(pendingFAQs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending FAQs' });
  }
});

// Answer a FAQ and change role to 'admin' (for admin panel)
router.put('/answer/:id', async (req, res) => {
  try {
    const { ans } = req.body;
    const updatedFAQ = await FAQ.findByIdAndUpdate(
      req.params.id,
      { ans, role: 'admin' },
      { new: true }
    );
    res.json(updatedFAQ);
  } catch (error) {
    res.status(500).json({ message: 'Error answering FAQ' });
  }
});

module.exports = router;
