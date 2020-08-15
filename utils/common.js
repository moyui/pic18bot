const consola = require("consola");

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

module.exports = {
  getBigImage,
};
