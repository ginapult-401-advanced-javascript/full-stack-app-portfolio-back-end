const express = require('express');
const authRouter = express.Router(); // eslint-disable-line

const User = require('../models/user/schema.js');
const auth = require ('../middleware/auth.js');
const oauth = require('../middleware/oauth/google.js');

// no auth for sign up - just creating a user on our system, make a new user
authRouter.post('/signup', (request, response, next) => {
  let user = new User(request.body);
  user.save()
    .then((user) => {
      request.token = user.generateToken();
      request.user = user;
      response.set('token', request.token);
      response.cookie('auth', request.token);
      response.send(request.token);
    })
    .catch(next);
});

authRouter.post('/signin', auth(), (request, response, next) => {
  response.set('token', request.token);
  response.cookie('auth', request.token);
  response.send(request.token);
});

authRouter.get('/oauth', (request, response, next) => {
  oauth.authorize(request)
    .then(token => {
      response.status(200).send(token);
    })
    .catch(next);
});

authRouter.post('/key', auth(), (request, response, next) => {
  let key = request.user.generateKey();
  response.status(200).send(key);
});

module.exports = authRouter;