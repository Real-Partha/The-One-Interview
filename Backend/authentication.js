const express = require('express');
const router = express.Router();
require('dotenv').config();
const passport = require('passport');

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

router.get('/google/callback', 
    passport.authenticate('google', {
        failureRedirect: '/login/failure',
        // successRedirect: process.env.CLIENT_URL,
    }),
    function(req, res) {
        console.log('iam here');
        console.log(req.user);
        res.redirect(process.env.CLIENT_URL);
    }
);

router.get('/login/failure', (req, res) => {
    res.status(401).json({ error:true,message: "Login failed" });
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


module.exports = router;