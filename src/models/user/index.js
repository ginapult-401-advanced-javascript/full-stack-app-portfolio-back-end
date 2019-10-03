const schema = require('./schema.js');
const MongooseModel = require('../mongoose-model.js');

class Users extends MongooseModel { }

module.exports = new Users(schema);
