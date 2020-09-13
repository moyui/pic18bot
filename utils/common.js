const consola = require("consola");
const { fetch } = require("./fetch");

const modeClass = {
  master: (path) => {
    return path;
  },
  origin: (path) => {
    return path
      .replace("img-master", "img-original")
      .replace("_master1200", "")
      .replace("jpg", "png");
  },
};

const getBigImage = (baseUrl, mode) => {
  try {
    const startIndex = baseUrl.indexOf("img-master");
    const path = baseUrl.slice(startIndex);
    const masterPath = modeClass[mode](path);
    return `https://i.pximg.net/${masterPath}`;
  } catch (e) {
    consola.error(e);
    return "";
  }
};

const getHTML = async (url) => {
  const res = await fetch(url);
  return res.data;
};

const sleep = (delay) => {
  const start = new Date().getTime();
  while (new Date().getTime() - start < delay) {
    continue;
  }
};

module.exports = {
  getBigImage,
  getHTML,
  sleep
};
