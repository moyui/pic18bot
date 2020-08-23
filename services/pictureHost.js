const { fetch } = require("../utils/fetch");
const { smms } = require("../config/index");
const consola = require("consola");

const URL = smms.api;

class PictureHostService {
  constructor() {
    this.token = "";
    this.profile = null;
  }

  async getToken() {
    const { username, password } = smms;

    return await fetch(URL.getToken, {
      method: "post",
      params: {
        username,
        password,
      },
    })
      .then((res) => {
        const {
          data: { token },
        } = res;
        this.token = token;
        return token;
      })
      .catch((error) => {
        consola.error("smms getToken失败", error);
        return "";
      });
  }

  async 

}

let pictureHostServiceEntity = null;

module.exports = {
  pictureHostService: function () {
    if (pictureHostServiceEntity) return pictureHostServiceEntity;
    pictureHostServiceEntity = new PictureHostService();
    return pictureHostServiceEntity;
  },
};
