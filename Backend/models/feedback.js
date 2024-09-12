// models/feedback.js
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  usability: { type: Number, required: true, min: 1, max: 5 },
  navigation: { type: Number, required: true, min: 1, max: 5 },
  design: { type: Number, required: true, min: 1, max: 5 },
  questionQuality: { type: Number, required: true, min: 1, max: 5 },
  answerQuality: { type: Number, required: true, min: 1, max: 5 },
  searchFunctionality: { type: Number, required: true, min: 1, max: 5 },
  sortingOptions: { type: Number, required: true, min: 1, max: 5 },
  companyTagging: { type: Number, required: true, min: 1, max: 5 },
  lightMode: { type: Number, required: true, min: 1, max: 5 },
  darkMode: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
