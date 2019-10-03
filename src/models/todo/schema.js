const mongoose = require('mongoose');

// eslint-disable-next-line new-cap
const todo = mongoose.Schema({
  title: { type: String, require: true },
  content: { type: String, require: true },
});

module.exports = mongoose.model('Todo', todo);