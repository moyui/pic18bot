class Rank {
  constructor(props) {
    const { router } = props;
    this.router = router;
    this.initRouter();
  }

  initRouter() {
    this.router.get("/v1/rank", async (ctx, next) => {
      await next();
    });
  }
}

module.exports = {
  rankController: (props) => new Rank(props),
};
