const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
    res.send("complete the login route");
});

router.post('/register', (req, res) => {
    res.send("complete the register route");
});

router.post('/verifyotp', (req, res) => {
    res.send("complete the verifyuser route");
});

router.post('/logout', (req, res) => {
    res.send("complete the logout route");
});

router.post('/forgot-password', (req, res) => {
    res.send("complete the forgot password route");
});

router.post('/reset-password', (req, res) => {
    res.send("complete the reset password route");
});

module.exports = router;