/**
 * Mongoose models and classmethods for interacting with Users
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true },
  googleId: { type: String, required: false },
  thumbnail: String,
  createdAt: { type: Date, required: false, default: Date.now() },
  lastModified: { type: Date, required: false, default: Date.now() },
});

module.exports = mongoose.model('User', userSchema);
