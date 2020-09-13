const consola = require("consola");
const mongoose = require("mongoose");
const dataBase = "mongodb://localhost:27017/pixiv";

mongoose.connection.on("connected", () => {
  consola.log("连接成功");
});
mongoose.connection.on("error", (error) => {
  consola.error(error);
});
mongoose.connection.on("disconnected", () => {
  consola.warn("断开连接");
});

mongoose.connect(dataBase);

module.exports = {};
