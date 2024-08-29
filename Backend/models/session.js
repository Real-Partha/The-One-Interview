const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deviceInfo: { type: String, required: true },
  ipAddress: { type: String, required: true },
  location: { type: String, required: true },
  lastActive: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Session', sessionSchema);