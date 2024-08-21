const express = require('express');
const User = require('./models/user');
const Comment = require('./models/comment');
const Question = require('./models/question');
const router = express.Router();

router.get("/question", async (req, res) => {
    try{
        const questions = await Question.find().skip((req.query.pageno-1)*10).limit(10);
        return res.status(200).send({questions:questions});
    }
    catch(err){
        console.error(err);
        return res.status(500).send({questions:[]});
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