const cheerio = require("cheerio");
const consola = require("consola");
const { rank } = require("../config/index");
const { getHTML, getBigImage, sleep } = require("../utils/common");
const { originImageService } = require("../services/originImage");
const { pictureHostService } = require("../services/pictureHost");

const { Rank50 } = require("../model/rank");
const { SMMS } = require("../model/smms");
const { Rank50Date } = require("../model/date");

const pictureService = pictureHostService();
const imageService = originImageService();

const getRank = async () => {
  const rankHtml = await getHTML(rank);
  return rankHtml;
};

const getRankingItem = (dom) => {
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

const getDateLog = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const daty = date.getDate();
  const hour = date.getHours();
  const min = date.getMinutes();
  const timePath = `${year}_${month}_${daty}_${hour}_${min}`;
  return timePath;
};

const handleError = (error) => {
  consola.error("database Error", error);
};

const RankTask = async () => {
  consola.log("RankTask开始执行", new Date());

  // 获取图床token
  await pictureService.getToken();
  const rank = await getRank();
  const content = getRankingItem(rank).slice(28, 30);
  let file = [];
  for (let i = 0; i < content.length; i++) {
    sleep((Math.random() + 1) * 1000);

    const fileData = await imageService.originImage({
      originUrl: content[i].src,
      masterUrl: content[i].master,
      artUrl: content[i].href,
      title: content[i].id,
    });

    file.push({
      image: { ...content[i], filePath: fileData.filePath },
      smms: null,
    });
  }

  for (let j = 0; j < file.length; j++) {
    consola.log("开始上传", file[j].image.filePath);
    const response = await pictureService.uploadImage(file[j].image.filePath);
    const smmsData = response.data;
    if (smmsData.success) {
      file[j].image.smmsUrl = smmsData.data.url;
      file[j].smms = smmsData.data;
    } else {
      consola.warn(smmsData);
      file[j].image.smmsUrl = smmsData.images || "";
    }
  }

  const dateLog = getDateLog();

  for (let k = 0; k < file.length; k++) {
    file[k].image.logDate = dateLog;
    if (file[k].smms) {
      SMMS.create(file[k].smms, function (error) {
        if (error) {
          return handleError(error);
        }
        consola.log("save success SMMS", file[k].smms);
      });
    }

    Rank50.create(file[k].image, function (error) {
      if (error) {
        return handleError(error);
      }
      consola.log("save success Rank50", file[k].image);
    });
  }
  Rank50Date.create({ logDate: dateLog }, function (error) {
    if (error) {
      return handleError(error);
    }
    consola.log("save success Rank50Date", dateLog);
  });
};

module.exports = {
  RankTask: () => {
    const time = 1000 * 60 * 60 * 12;
    // 立即执行一次
    RankTask();
    const timer = setInterval(RankTask, time);
  },
};
