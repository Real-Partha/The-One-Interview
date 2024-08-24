require('dotenv').config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
const { uploadObject } = require("../utils/amazonS3");
const axios = require('axios');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          return done(null, user);
        } else {
          const username = profile.displayName.replace(/\s/g, "").toLowerCase();
          let newUsername = username;
          let counter = 1;
          while (await User.findOne({ username: newUsername })) {
            newUsername = username + counter;
            counter++;
          }

          // Download and upload profile picture to S3
          let profile_pic_id = null;
          if (profile.photos && profile.photos[0] && profile.photos[0].value) {
            try {
              const response = await axios.get(profile.photos[0].value, { responseType: 'arraybuffer' });
              const buffer = Buffer.from(response.data, 'binary');
              profile_pic_id = `${newUsername}_${Date.now()}.jpg`;
              await uploadObject(profile_pic_id, buffer);
            } catch (error) {
              console.error('Error uploading profile picture to S3:', error);
            }
          }

          const newUser = new User({
            username: newUsername,
            email: profile.emails[0].value,
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            type: "google",
            role: "user",
            gender: "Not specified",
            date_of_birth: null,
            profile_pic: profile_pic_id,
          });
          await newUser.save();
          return done(null, newUser);
        }
      } catch (error) {
        console.error('Error in Google Strategy:', error);
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
