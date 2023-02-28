module.exports = {
  ensureAuth: function (req, res, next) {
    if (req.user) {
      return next();
    }
    res.status(401).json({
      message: 'Not authorized',
      data: [],
      success: false,
    });
  },

  // make a isCollab function
};
