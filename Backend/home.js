const express = require('express');
const User = require('./models/user');
const Comment = require('./models/comment');
const Question = require('./models/question');
const {getSignedUrlForObject,uploadObject} =require('./amazonS3');
const router = express.Router();
const commentsRouter = require('./comments');
router.use('/questions', commentsRouter);
router.get("/question", async (req, res) => {
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

router.get("/getprofilepic", async (req, res) => {
    try {
        const profilepic = req.user.proflie_pic;
        const profilepicurl=await getSignedUrlForObject(profilepic);
        return res.status(200).send({ status: true, profilePic:  profilepicurl});
    } catch (err) {
        console.error(err);
        return res.status(500).send({ status: false });
    }
});
module.exports = router;