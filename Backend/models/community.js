const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a community name'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a community description']
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    lookingFor: [{
        type: String
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rules: {
        type: String
    },
    isPrivate: {
        type: Boolean,
        default: false
    }
});

const Community = mongoose.model('Community', communitySchema);
module.exports = Community;
