const express = require('express');
// use model-finder middleware to import models
const modelFinder = require('../middleware/model-finder.js');
const auth = require('../middleware/auth.js');
// eslint-disable-next-line new-cap
const router = express.Router();

// if a specific paramter with which to run our middleware
// if this paramter exists, I want you to send this request to the modelfinder middleware
// can't put auth in below because modelFinder won't run - will get undefined
router.param('model', modelFinder);

// define consistent set of routes to be used for any model
// use model-finder middleware to import models
// by the time these models get hit we should have a request.model to access
router.get('/api/v1/:model', /** Handlers go here */handleGetAll);
router.get('/api/v1/:model/:id', handleGetOne);

router.post('/api/v1/:model/', handlePost);
router.put('/api/v1/:model/:id', handlePut);
router.delete('/api/v1/:model/:id', handleDelete);
// mongoosde - model.find, model.create, model.update corresponds
// middleware puts the model onto the request object

function handleGetAll(request, response, next) {
  request.model.get()
    .then(results => {
      response.json(results);
    })
    .catch(next);
}

function handleGetOne(request, response, next) {
  const id = request.params.id;
  request.model.get(id)
    .then(results => {
      response.json(results[0]);//always returns an array so want one item
    })
    .catch(next);
}

function handlePost(request, response, next) {
  const data = request.body;
  request.model.post(data)
    .then(results => response.json(results))
    .catch(next);
}

function handlePut(request, response, next) {
  const id = request.params.id;
  const data = request.body;
  request.model.post(id, data)
    .then(results => response.json(results))
    .catch(next);
}

function handleDelete(request, response, next) {
  const id = request.params.id;
  request.model.delete(id)
    .then((result) => {
      response.status = 204;
    })
    .catch(next);
}

module.exports = router;