const schema = require('./schema.js');
const MongooseModel = require('../mongoose-model.js');

class Todos extends MongooseModel { }

module.exports = new Todos(schema);