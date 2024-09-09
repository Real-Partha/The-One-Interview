const mongoose = require('mongoose');

const pendingUserSchema = new mongoose.Schema({
  username: String,
  first_name: String,
  last_name: String,
  email: String,
  password: String,
  gender: String,
  date_of_birth: Date,
  expiresAt: Date
});

module.exports = mongoose.model('PendingUser', pendingUserSchema);