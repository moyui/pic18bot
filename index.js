const Koa = require("koa");
const Router = require("@koa/router");
const MongoClient = require("mongodb").MongoClient;

const { rankController } = require("./controller/rank");
const { smmsController } = require("./controller/smms");

const app = new Koa();
const router = new Router();

const dataBase = "mongodb://localhost:27017/runoob";

(function initController() {
  rankController({ router });
  smmsController({ router });
})();

app.use(router.routes()).use(router.allowedMethods());

const server = app.listen(8001);
server.setTimeout(1000 * 60 * 5);

