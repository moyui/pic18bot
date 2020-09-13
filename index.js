const Koa = require("koa");
const Router = require("@koa/router");

const { rankController } = require("./controller/rank");
const { smmsController } = require("./controller/smms");
// const loginHook = require("./hooks/login");
require("./services/database");

const { RankTask } = require("./task/rank");

const app = new Koa();
const router = new Router();

(function initController() {
  rankController({ router });
  smmsController({ router });
})();

(function initHooks() {
  // 这个中间件废弃了，pixiv更新了登录反爬虫机制
  // loginHook();
})();

app.use(router.routes()).use(router.allowedMethods());

const server = app.listen(8001);
server.setTimeout(1000 * 60 * 5);

RankTask();
