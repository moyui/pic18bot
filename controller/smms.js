const { pictureHostService } = require("../services/pictureHost");

class SMMS {
  constructor(props) {
    const { router } = props;
    this.router = router;
    this.initRouter();
  }

  initRouter() {
    this.router.get("/v1/smms", async (ctx, next) => {
        const token = await pictureHostService().getToken();
        await next();
    });
  }
}

module.exports = {
  smmsController: (props) => new SMMS(props),
};
