const consola = require("consola");
const { fetch } = require("../utils/fetch");
const { writeFileRecursive } = require("../utils/write");

class OriginImageService {
  constructor() {
    this.fileRootPath = "./image/";
  }

  async originImage({
    originUrl = "",
    masterUrl = "",
    artUrl = "",
    title = "",
  }) {
    let filePath = "";
    try {
      const data = await this._originImageFetch({ originUrl, artUrl });
      filePath = await this._originImageWritin(data, title, false);
    } catch (error) {
      consola.log("originImageService获取图片失败, error:", error);
      // 如果不是OriginUrl, 用masterUrl再请求一次
      if (error.response.status === 404) {
        consola.log("originImageService使用masterUrl请求, url:", masterUrl);
        const data = await this._originImageFetch({
          originUrl: masterUrl,
          artUrl,
        });
        filePath = await this._originImageWritin(data, title, true);
      }
    }
    return {
      title,
      filePath,
    };
  }

  async _originImageFetch({ originUrl = "", artUrl = "" }) {
    return await fetch(originUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
        "Accept-Encoding": "gzip",
        Referer: artUrl,
      },
      responseType: "arraybuffer",
    }).then((data) => {
      consola.log("originImageService获取图片成功, data:", data);
      return null;
    });
  }

  _originImageWritin(data, title, isMaster) {
    const filePath = this._getFilePath(title, isMaster);
    consola.log("originImageService开始保存图片, filePath:", filePath);
    return new Promise((resolve, reject) => {
      writeFileRecursive(filePath, data, (err) => {
        if (err) {
          return reject(error);
        }
        return resolve(filePath);
      });
    }).catch((error) => {
      consola.log("originImageService写入图片失败, error:", error);
      return null;
    });
  }

  _getFilePath(fileName, isMaster) {
    // 以小时为单位保存数据
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const daty = date.getDate();
    const hour = date.getHours();
    const timePath = `${year}_${month}_${daty}_${hour}/`;
    return (
      this.fileRootPath +
      timePath +
      `${encodeURIComponent(fileName)}.${isMaster ? "jpg" : "png"}`
    );
  }
}

let originImageServiceEntity = null;

module.exports = {
  originImageService: function () {
    if (originImageServiceEntity) return originImageServiceEntity;
    originImageServiceEntity = new OriginImageService();
    return originImageServiceEntity;
  },
};
