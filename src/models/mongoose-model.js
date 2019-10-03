// this is just a big class - will look relatively empty
// provide a constructor that will hold our mongoose schema
// then have a couple of mongoose defined methods that we can
// run directly on our schema
// class that encapsulates a mongoose model - now we can use
// full CRUD

class DataModel {
  constructor(schema) {
    this.schema = schema;
  }

  // four methods - get, post, put delete - from mongoose documentation

  get(id) {
    let query = id ? { _id: id } : {};// _id is the mongoose id
    return this.schema.find(query);
  }
  post(record) {
    let newRecord = new this.Schema(record);
    return newRecord.save();
    // this is how you create a new instance of the new model and have it persist
    // all return promises so when call them, need async await or chain .then
  }
  put(id, record) {
    const filter = { _id: id };
    const update = record;

    return this.schema.findOneAndUpdate(filter, update);
  }
  delete(id) {
    const filter = { _id: id };
    return this.schema.findOneAndDelete(filter);
  }
}

module.exports = DataModel;