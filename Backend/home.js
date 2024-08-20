const express = require('express');
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

module.exports = router;