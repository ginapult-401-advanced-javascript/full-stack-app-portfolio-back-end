const express = require('express');
const project = require('../models/project/index.js')

// eslint-disable-next-line new-cap
const projectRouter = express.Router();

projectRouter.get('/projects', handleGetAll);
projectRouter.get('/projects/:id', handleGetOne);
projectRouter.post('/projects', handlePost);
projectRouter.put('/projects/:id', handlePut);
projectRouter.delete('/projects/:id', handleDelete);

function handleGetAll(request, response, next) {
  project.get()
    .then(results => {
      response.json(results);
    })
    .catch(next);
}

function handleGetOne(request, response, next) {
  const id = request.params.id;
  project.get(id)
    .then(results => {
      response.json(results[0]);
    })
    .catch(next);
}

function handlePost(request, response, next) {
  const data = request.body;
  project.post(data)
    .then(results => response.json(results))
    .catch(next);
}

function handlePut(request, response, next) {
  const id = request.params.id;
  const data = request.body;
  project.post(id, data)
    .then(results => response.json(results))
    .catch(next);
}

function handleDelete(request, response, next) {
  const id = request.params.id;
  project.delete(id)
    .then((result) => {
      response.status = 204;
    })
    .catch(next);
}

module.exports = projectRouter;