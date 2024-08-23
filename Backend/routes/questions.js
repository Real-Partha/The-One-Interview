const express = require('express');
const User = require('../models/user');
const Comment = require('../models/comment');
const Question = require('../models/question');
const {getSignedUrlForObject} =require('../utils/amazonS3');
const router = express.Router();

const commentsRouter = require('./comments');
router.use('/questions', commentsRouter);

router.get("/questions", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const totalQuestions = await Question.countDocuments();
        const totalPages = Math.ceil(totalQuestions / limit);

        const questions = await Question.find()
            .skip(skip)
            .limit(limit)
            .lean();

        const userIds = questions.map(q => q.user_id);
        const users = await User.find({ _id: { $in: userIds } }, { _id: 1, username: 1 }).lean();

        const userMap = users.reduce((acc, user) => {
            acc[user._id.toString()] = user.username;
            return acc;
        }, {});

        const questionsWithUsernames = await Promise.all(questions.map(async (question) => {
            const profilepic = await User.findOne({ _id: question.user_id }).select('profile_pic -_id');
            const profilePicUrl = await getSignedUrlForObject(profilepic.toObject().profile_pic);
            return {
                ...question,
                username: userMap[question.user_id.toString()] || 'Unknown User',
                profile_pic: profilePicUrl
            };
        }));

        return res.status(200).send({
            questions: questionsWithUsernames, 
            currentPage: page,
            totalPages: totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ questions: [], error: 'An error occurred while fetching questions' });
    }
});

router.get("/question/:id", async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).send({ error: 'User not authenticated' });
        }

        const question = await Question.findOne({ _id: req.params.id }).lean();
        if (!question) {
            return res.status(400).send({ error: 'Invalid question_id' });
        }
        await Question.updateOne({ _id: req.params.id }, { $inc: { impressions: 1 } });
        const user = await User.findOne({ _id: question.user_id }).lean();
        const profilepic = await User.findOne({ _id: question.user_id }).select('profile_pic -_id');
        const profilePicUrl = await getSignedUrlForObject(profilepic.toObject().profile_pic);
        const comments = await Comment.find({ question_id: req.params.id }).lean();

        const userVote = question.upvotedBy.includes(req.user._id) ? 'upvote' :
                         question.downvotedBy.includes(req.user._id) ? 'downvote' : null;

        return res.status(200).send({
            ...question,
            username: user.username,
            profile_pic: profilePicUrl,
            comments: comments,
            userVote: userVote
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: 'An error occurred while fetching question' });
    }
});

router.get("/questionsearch", async (req, res) => {
    try {
        const search = req.query.query || "";
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        let mainSearchTerm = search;
        let hashtagKeyword = "";

        if (search.includes("#")) {
            const parts = search.split("#");
            mainSearchTerm = parts[0].trim();
            hashtagKeyword = parts[1].trim();
        }

        const searchQueries = [];

        if (mainSearchTerm && hashtagKeyword) {
            searchQueries.push(
                Question.find(
                    { $text: { $search: mainSearchTerm }, tags: hashtagKeyword },
                    { score: { $meta: "textScore" } }
                ).sort({ score: { $meta: "textScore" } }).lean()
            );
        }

        if (mainSearchTerm) {
            searchQueries.push(
                Question.find(
                    { $text: { $search: mainSearchTerm } },
                    { score: { $meta: "textScore" } }
                ).sort({ score: { $meta: "textScore" } }).lean()
            );
        }

        if (hashtagKeyword) {
            searchQueries.push(
                Question.find(
                    { tags: hashtagKeyword }
                ).lean()
            );
        }

        const [mainAndTagResults, mainResults, tagResults] = await Promise.all(searchQueries);

        const combinedResults = [
            ...(mainAndTagResults || []),
            ...(mainResults || []),
            ...(tagResults || [])
        ];

        const totalQuestions = combinedResults.length;
        const totalPages = Math.ceil(totalQuestions / limit);
        const paginatedResults = combinedResults.slice(skip, skip + limit);

        const userIds = paginatedResults.map(q => q.user_id);
        const users = await User.find({ _id: { $in: userIds } }, { _id: 1, username: 1 }).lean();
        const userMap = users.reduce((acc, user) => {
            acc[user._id.toString()] = user.username;
            return acc;
        }, {});

        const questionsWithUsernames = await Promise.all(paginatedResults.map(async (question) => {
            const profilepic = await User.findOne({ _id: question.user_id }).select('profile_pic -_id');
            const profilePicUrl = await getSignedUrlForObject(profilepic.toObject().profile_pic);
            return {
                ...question,
                username: userMap[question.user_id.toString()] || 'Unknown User',
                profile_pic: profilePicUrl
            };
        }));

        return res.status(200).send({
            questions: questionsWithUsernames,
            currentPage: page,
            totalPages: totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ questions: [], error: 'An error occurred while fetching questions' });
    }
});

router.post("/question", async (req, res) => {
    try {
        const question = await Question.create(req.body);
        return res.status(201).send(question);
    } catch (err) {
        console.error(err);
        return res.status(500).send({status:false, error: 'An error occurred while creating question' });
    }
});

router.delete("/question", async(req, res) => {
    try{
        const question = await Question.findById(req.body.id);
        if(question === null) {
            return res.status(400).send({ error: 'Invalid question_id' });
        }
        await Question.findByIdAndDelete(req.body.id);
        return res.status(200).send({status:true});
    }
    catch(err){
        console.error(err);
        return res.status(500).send({status:false});
    }
});

router.patch("/upvote", async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).send({ error: 'User not authenticated' });
        }

        const { _id } = req.body;
        const userId = req.user._id;

        const question = await Question.findById(_id);
        if (!question) {
            return res.status(400).send({ error: 'Invalid question_id' });
        }

        const alreadyUpvoted = question.upvotedBy.includes(userId);
        const alreadyDownvoted = question.downvotedBy.includes(userId);

        if (alreadyUpvoted) {
            return res.status(400).send({ error: 'User has already upvoted this question' });
        }

        let update = { $inc: { upvotes: 1 }, $push: { upvotedBy: userId } };
        if (alreadyDownvoted) {
            update.$inc.downvotes = -1;
            update.$pull = { downvotedBy: userId };
        }

        await Question.updateOne({ _id }, update);
        return res.status(200).send({ status: true, message: 'Question upvoted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ status: false, error: 'An error occurred while upvoting question' });
    }
});

router.patch("/downvote", async (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).send({ error: 'User not authenticated' });
        }

        const { _id } = req.body;
        const userId = req.user._id;

        const question = await Question.findById(_id);
        if (!question) {
            return res.status(400).send({ error: 'Invalid question_id' });
        }

        const alreadyDownvoted = question.downvotedBy.includes(userId);
        const alreadyUpvoted = question.upvotedBy.includes(userId);

        if (alreadyDownvoted) {
            return res.status(400).send({ error: 'User has already downvoted this question' });
        }

        let update = { $inc: { downvotes: 1 }, $push: { downvotedBy: userId } };
        if (alreadyUpvoted) {
            update.$inc.upvotes = -1;
            update.$pull = { upvotedBy: userId };
        }

        await Question.updateOne({ _id }, update);
        return res.status(200).send({ status: true, message: 'Question downvoted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ status: false, error: 'An error occurred while downvoting question' });
    }
});

router.get("/checkusername", async (req, res) => {
    console.log("i m here");
    const username = req.query.username;
    try {
        const user = await User.findOne({ username: username });
        console.log(user);
        return res.status(200).send({ status: user===null ? true : false });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ status: false });
    }
});
module.exports = router;