const express = require("express");
const router = express.Router();
const User = require('../models/user');

router.get("/check-username/:username", async (req, res) => {
    try {
        const { username } = req.params;
        const existingUser = await User.findOne({ username });
        res.json({ available: !existingUser });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error checking username", error: error.message });
    }
});

router.get("/check-email/:email", async (req, res) => {
    try {
        const { email } = req.params;
        const existingUser = await User.findOne({ email });
        res.json({ exists: !!existingUser });
    } catch (error) {
        res
            .status(500)
            .json({ message: "Error checking email", error: error.message });
    }
});

module.exports = router;