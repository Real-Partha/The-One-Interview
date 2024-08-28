const mongoose = require('mongoose');

const adminPasskeySchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  admin_passkey: {
    type: String,
    required: true
  }
});

const AdminPasskey = mongoose.model('AdminPasskey', adminPasskeySchema);

module.exports = AdminPasskey;
