const passport = require('passport');
const User = require('../models/user');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (user.password) {
        delete user.password;
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

require('../Strategy/oneIdStrategy');
require('../Strategy/googleStrategy');

module.exports = passport;
