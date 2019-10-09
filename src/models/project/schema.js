const mongoose = require('mongoose');

// eslint-disable-next-line new-cap
const project = mongoose.Schema({
  title: { type: String, required:true },
  description: { type: String },
  imgUrl: { type: String },
  githubUrl: { type: String },
  deployedIrl: { type: String },
});

module.exports = mongoose.model('project', project);