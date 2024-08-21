const express = require('express');
const User = require('./models/user');
const router = express.Router();

router.post("/post", (req, res) => {
    res.send("complete the addpost route");
});

router.delete("/post", (req, res) => {
    res.send("complete the deletepost route");
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