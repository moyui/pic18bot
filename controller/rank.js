const { rank } = require("../config/index");
const { getHTML, getBigImage } = require("../utils/common");
const { originImageService } = require("../services/originImage");
const { pictureHostService } = require("../services/pictureHost");
const cheerio = require("cheerio");

function sleep(delay) {
  var start = new Date().getTime();
  while (new Date().getTime() - start < delay) {
    continue;
  }
}

class Rank {
  constructor(props) {
    const { router } = props;
    this.router = router;
    this.initRouter();
  }

  initRouter() {
    this.router.get("/v1/rank", async (ctx, next) => {
      const rank = await this.getRank();
      const content = this.getRankingItem(rank).slice(0, 5);
      let file = [];
      for (let i = 0; i < content.length; i++) {
        sleep((Math.random() + 1) * 1000);
        file.push(
          await originImageService().originImage({
            originUrl: content[i].src,
            masterUrl: content[i].master,
            artUrl: content[i].href,
            title: content[i].title + "-" + content[i].userName,
          })
        );
      }
      await pictureHostService().getToken();
      for (let j = 0; j < file.length; j++) {
        await pictureHostService().uploadImage(file[j].filePath);
      }
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
