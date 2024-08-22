const express = require('express');
const User = require('./models/user');
const Comment = require('./models/comment');
const Question = require('./models/question');
const router = express.Router();

router.get("/question", async (req, res) => {
    try {
        const questions = await Question.find()
            .skip((req.query.pageno - 1) * 10)
            .limit(10)
            .lean(); // Use lean() for better performance

        // Fetch usernames for all questions in a single query
        const userIds = questions.map(q => q.user_id);
        const users = await User.find({ _id: { $in: userIds } }, { _id: 1, username: 1 }).lean();

        // Create a map of user IDs to usernames
        const userMap = users.reduce((acc, user) => {
            acc[user._id.toString()] = user.username;
            return acc;
        }, {});

        // Add username to each question
        const questionsWithUsernames = questions.map(question => ({
            ...question,
            username: userMap[question.user_id.toString()] || 'Unknown User'
        }));
        return res.status(200).send({ questions: questionsWithUsernames });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ questions: [] });
    }
});

router.delete("/question", async(req, res) => {
    try{
        console.log(req.body.id);
        await Question.findByIdAndDelete(req.body.id);
        return res.status(200).send({status:true});
    }
    catch(err){
        console.error(err);
        return res.status(500).send({status:false});
    }
});

router.post("/reply", (req, res) => {
    res.send("complete the addreply route");
});

router.delete("/reply", (req, res) => {
    res.send("complete the deletereply route");
});

router.get("/reply", (req, res) => {
    res.send("complete the getreplies route");
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