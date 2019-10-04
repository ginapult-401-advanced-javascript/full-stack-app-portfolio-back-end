// purpose - handle per request what logic do I want to run
// request - modify resource - router says I know - parse info, you're trying to xxx, I'll go to this route
// now I'm going to run this logic
// test it out on postman - using more Test Driven Development here
// write tests first bfore doing any of this
// user supertest - make simple request, sign up and sign in with given headers mocked data
// back end doesnt care what the front end does - all it needs is the token
// need to make sure that requests from fe are configured properly
// write tests - you know what test will look like
// utility request function - preconfigure it - plug into requests
// react has lifecycle methods - when requests get made - those with token go to API, if a 401 or 403 with response, fire off log off or resign in
// update methods - every time update in form, check to see if token is valid , can have options inside token that say when it will expire on its own
// can use front end JWT to check tokens on front end - if session expiers, re log in
// don't worry about expired tokens for now

const express = require('express');
const authRouter = express.Router(); // eslint-disable-line

const User = require('../models/user/schema.js');
const auth = require ('../middleware/auth.js');
// const oauth = require('../middleware/oauth/google.js');

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

// authRouter.get('/oauth', (request, response, next) => {
//   oauth.authorize(request)
//     .then(token => {
//       response.status(200).send(token);
//     })
//     .catch(next);
// });

authRouter.post('/key', auth(), (request, response, next) => {
  let key = request.user.generateKey();
  response.status(200).send(key);
});

module.exports = authRouter;