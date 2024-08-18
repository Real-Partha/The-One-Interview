const express = require('express');
const router = express.Router();

router.post("/addpost", (req, res) => {
    res.send("complete the addpost route");
});

router.post("/deletepost", (req, res) => {
    res.send("complete the deletepost route");
});

router.post("/addreply", (req, res) => {
    res.send("complete the addreply route");
});

router.post("/deletereply", (req, res) => {
    res.send("complete the deletereply route");
});

router.get("/getreplies", (req, res) => {
    res.send("complete the getreplies route");
});

module.exports = router;