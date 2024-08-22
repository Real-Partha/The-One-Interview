const express = require('express');
const router = express.Router();
const Question = require('../models/question');
const Comment = require('../models/comment');

router.get('/comments', async (req, res) => {
    try {
        console.log(req.query.question_id);
        const question_id = req.query.question_id;
        const status = await Question.findOne({_id:question_id}).lean();
        if(status === null) {
            return res.status(400).send({ status: false,error: 'Invalid question_id' });
        }
        const comments = await Comment.find({ question_id: question_id}).lean();
        return res.status(200).send(comments);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ status: false,error: 'An error occurred while fetching comments' });
    }
});

router.post('/comments', async (req, res) => {
    try {
        const status = await Question.findOne({_id:req.body.question_id}).lean();
        if(status === null) {
            return res.status(400).send({ status: false,error: 'Invalid question_id' });
        }
        if(req.body.comment === '') {
            return res.status(400).send({ status: false,error: 'Please provide a comment' });
        }
        // increase replies count by 1
        await Question.updateOne({ _id: req.body.question_id }, { $inc: { commentscount: 1 }});
        const comment = await Comment.create(req.body);
        return res.status(201).send(comment);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ status: false,error: 'An error occurred while creating comment' });
    }
});

router.delete('/comments', async (req, res) => {
    try {
        const comment = await Comment.findById(req.body._id);
        if(comment === null) {
            return res.status(400).send({ error: 'Invalid comment_id' });
        }
        // if(comment.user_id !== req.user._id) {
        //     return res.status(400).send({ error: 'Invalid user_id' });
        // }
        await Comment.findByIdAndDelete(req.body._id);
        return res.status(200).send({ status: true , message: 'Comment deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ status: false,error: 'An error occurred while deleting comment' });
    }
});

module.exports = router;