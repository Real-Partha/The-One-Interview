const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: [true, 'Please provide a comment'],
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    question_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

