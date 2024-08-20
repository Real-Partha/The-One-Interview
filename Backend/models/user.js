const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: [true, 'Username already exists'],
    },
    first_name: {
        type: String,
        required: [true, 'Please provide a first name'],
    },
    last_name: {
        type: String,
        required: [true, 'Please provide a last name'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: [true, 'Email already exists'],
    },
    password: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    type: {
        type: String,
        required: [true, 'An account type is required'],
    },
    role: {
        type: String,
        required: [true, 'A role is required'],
    },
});

// Hash password before saving if it was set
userSchema.pre('save', async function (next) {
    if (this.password && this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
