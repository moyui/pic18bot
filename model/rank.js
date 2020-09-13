const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rankSchema = new Schema({
  rank: String,
  title: String,
  userName: String,
  date: String,
  viewCount: String,
  id: String,
  thumbnail: String,
  src: String,
  master: String,
  href: String,
  smmsUrl: String,
  logDate: String,
  filePath: String
});

const Rank50 = mongoose.model("Rank50", rankSchema);

module.exports = {
  Rank50,
};
