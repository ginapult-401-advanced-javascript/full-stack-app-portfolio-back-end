const schema = require('./schema.js');
const MongooseModel = require('../mongoose-model.js');

class Projects extends MongooseModel { }

module.exports = new Projects(schema);