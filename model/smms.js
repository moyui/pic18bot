const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const smmsSchema = new Schema({
    file_id: Number,
    width: Number,
    height: Number,
    filename: String,
    storename: String,
    size: Number,
    path: String,
    hash: String,
    url: String,
    delete: String,
    page: String,
  });
  
const SMMS = mongoose.model("SMMS", smmsSchema);

module.exports = {
  SMMS,
};