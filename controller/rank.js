const { Rank50Date } = require("../model/date");
const { Rank50 } = require("../model/rank");

class Rank {
  constructor(props) {
    const { router } = props;
    this.router = router;
    this.initRouter();
  }

  initRouter() {
    this.router.get("/v1/rank", async (ctx, next) => {
      const lastLogDate = await new Promise((resolve, reject) => {
        Rank50Date.findOne()
          .sort({ logDate: -1 })
          .exec(function (err, data) {
            if (err) return reject(err);
            return resolve(data.logDate);
          });
      });

      const rank50 = await new Promise((resolve, reject) => {
        Rank50.find()
          .where("logDate")
          .equals(lastLogDate)
          .exec(function (err, data) {
            if (err) return reject(err);
            return resolve(data);
          });
      });

      ctx.status = 200;
      ctx.body = {
        status: "1",
        lastLogDate: lastLogDate,
        data: rank50,
      };
      return;
    });
  }
}

module.exports = {
  rankController: (props) => new Rank(props),
};
