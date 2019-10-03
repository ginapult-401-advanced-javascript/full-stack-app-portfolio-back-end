'use strict';

module.exports = (request, response, next) => {
  // all functions that sit on express route get request, response, next
  // since it's a middleware, really use next, otherwise will hang
  const modelName = request.params.model;
  // request.params are the variables in the path of the colon "http://localhost:8080/v1/api/users/"
  // can define a wildcard in the path using "users/:userId" - could be a user string or id#
  // will be more like '/api/model/:modelName'
  // use this to set an object on our request object
  request.model = require(`../model/${modelName}`);
  next();
};
