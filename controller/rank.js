const { rank } = require("../config/index");
const { getHTML, getBigImage } = require("../utils/common");
const { originImageService } = require("../services/originImage");
const cheerio = require("cheerio");

class Rank {
  constructor(props) {
    const { router } = props;
    this.router = router;
    this.initRouter();
  }

  initRouter() {
    this.router.get("/v1/rank", async (ctx, next) => {
      const rank = await this.getRank();
      const content = this.getRankingItem(rank);

      const test1 = content[0];
      const file = await originImageService().originImage({
        originUrl: test1.src,
        masterUrl: test1.master,
        artUrl: test1.href,
        title: test1.title + "-" + test1.userName,
      });

      console.log(file);
      await next();
    });
  }

  async getRank() {
    const rankHtml = await getHTML(rank);
    return rankHtml;
  }

  getRankingItem(dom) {
    const $ = cheerio.load(dom);
    const rankItem = $("section.ranking-item");

    const res = [];

    rankItem.each((index, item) => {
      const img = $(item).find("img");
      const achor = $(item).find(".work");
      const src = img.data("src");
      const href = achor.attr("href");

      res.push({
        rank: item.attribs["data-rank"],
        title: item.attribs["data-title"],
        userName: item.attribs["data-user-name"],
        date: item.attribs["data-date"],
        viewCount: item.attribs["data-view-count"],
        id: item.attribs["data-id"],
        thumbnail: src,
        src: getBigImage(src, "origin"),
        master: getBigImage(src, "master"),
        href: `https://www.pixiv.net${href}`,
      });
    });

    return res;
  }
}

module.exports = {
  rankController: (props) => new Rank(props),
};
