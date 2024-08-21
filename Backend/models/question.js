const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Please provide a question'],
    },
    answer: {
        type: String,
        required: [true, 'Please provide an answer'],
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    tags: {
        type: [String],
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    upvotes: {
        type: Number,
        default: 0,
    },
    downvotes: {
        type: Number,
        default: 0,
    },
    impressions: {
        type: Number,
        default: 0,
    },
    repliescount: {
        type: Number,
        default: 0,
    }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;