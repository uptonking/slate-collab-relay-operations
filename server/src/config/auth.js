const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      //check if user already exists in db
      User.findOne({ googleId: profile.id }).then((currentUser) => {
        if (currentUser) {
          console.log('User already exists: ' + currentUser);
          done(null, currentUser);
        } else {
          // if user doesn't exist
          new User({
            userName: profile.displayName,
            googleId: profile.id,
            email: profile._json.email,
            thumbnail: profile._json.picture,
          })
            .save()
            .then((newUser) => {
              console.log('New User Created' + newUser);
              done(null, newUser);
            });
        }
      });
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});
