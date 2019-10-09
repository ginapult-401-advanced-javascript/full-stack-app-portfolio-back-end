class DataModel {
  constructor(Schema) {
    this.Schema = Schema;
  }

  // four methods - get, post, put delete - from mongoose documentation

  get(id) {
    let query = id ? { _id: id } : {};// _id is the mongoose id
    return this.Schema.find(query);
  }
  post(record) {
    let newRecord = new this.Schema(record);
    return newRecord.save();
  }
  put(id, record) {
    const filter = { _id: id };
    const update = record;

    return this.Schema.findOneAndUpdate(filter, update);
  }
  delete(id) {
    const filter = { _id: id };
    return this.Schema.findOneAndDelete(filter);
  }
}

module.exports = DataModel;

