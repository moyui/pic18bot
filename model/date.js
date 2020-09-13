const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rank50DateSchema = new Schema({
  logDate: String,
});

const Rank50Date = mongoose.model("Rank50Date", rank50DateSchema);

module.exports = {
  Rank50Date,
};
