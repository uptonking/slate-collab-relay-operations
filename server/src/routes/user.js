const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const CLIENT_HOMEPAGE_URL = 'http://localhost:3000';

// google auth handler
userRouter.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  }),
);

// google auth callback
userRouter.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    successRedirect: CLIENT_HOMEPAGE_URL,
    failureRedirect: '/auth/login/failed',
  }),
);

userRouter.get('/auth/login/success', (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: 'user has successfully authenticated',
      user: req.user,
      cookies: req.cookies,
    });
  }
});

// login route
userRouter.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect(CLIENT_HOMEPAGE_URL);
});

module.exports = userRouter;
