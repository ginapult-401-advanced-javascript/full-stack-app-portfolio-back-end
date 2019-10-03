// our entry file - configures and starts a server - kicks off our application - something node can grab and do all the things we programmed

require('dotenv').config();
const server = require('./src/app.js');
const mongoose = require('mongoose');

// configures and starts a server
const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
}

mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
server.start(process.env.PORT);