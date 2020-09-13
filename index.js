const Koa = require("koa");
const Router = require("@koa/router");
const process = require("process");
const consola = require("consola");

const { rankController } = require("./controller/rank");
const { smmsController } = require("./controller/smms");
require("./services/database");

const { RankTask } = require("./task/rank");

const app = new Koa();
const router = new Router();

(function initController() {
  rankController({ router });
  smmsController({ router });
})();

app.use(router.routes()).use(router.allowedMethods());

const server = app.listen(8001);
server.setTimeout(1000 * 60 * 5);

process.on("uncaughtException", (err) => {
  consola.error("uncaughtException", err);
});

(function initTask() {
  if (process.env.NODE_ENV === "production") {
    RankTask();
  }
})();
