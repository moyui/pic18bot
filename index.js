const Koa = require("koa");
const router = require("@koa/router");
const consola = require("consola");
const cheerio = require("cheerio");
const MongoClient = require("mongodb").MongoClient;

const { fetch } = require("./utils/fetch");
const { getBigImage } = require("./utils/common");

const { originImageService } = require("./services/originImage");

const app = new Koa();

app.use(router);

const dataBase = "mongodb://localhost:27017/runoob";

const pixiv = "https://www.pixiv.net/";

const getHTML = async (url) => {
  const html = await fetch(url);
  return html;
};

const rank = pixiv + "ranking.php";

const getRank = async () => {
  const rankHtml = await getHTML(rank);
  return rankHtml;
};

const getRankingItem = async () => {
  const dom = await getRank();
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
};

async function main() {
  const content = await getRankingItem();
  // 选取一张测试用
  const test1 = content[0];
  console.log(test1)

  originImageService().originImageFetch({
    originUrl: test1.src,
    masterUrl: test1.master,
    artUrl: test1.href,
    title: test1.title + "-" + test1.userName,
  });
}

main();

app.listen(8001);
