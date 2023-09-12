const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  isAdmin: Boolean,
  isEditor: Boolean,
});

module.exports = mongoose.model('User', userSchema);
