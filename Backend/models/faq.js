// models/faq.js
const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  ans: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('FAQ', faqSchema);
