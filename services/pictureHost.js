const { fetch } = require("../utils/fetch");
const { smms } = require("../config/index");
const FormData = require("form-data");
const path = require("path");
const fs = require("fs");
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
        } = res.data;
        this.token = token;
        return token;
      })
      .catch((error) => {
        consola.error("smms getToken失败", error);
        return "";
      });
  }

  async createAlbums({ type, description }) {
    if (!this.token) return Promise.reject();
    return await fetch(URL.createAlbum, {
      method: "post",
      headers: {
        Authorization: `basic ${this.token}`,
      },
      data: {
        album_name: type || "default",
        album_description: description || "",
      },
    });
  }

  async uploadImage(file) {
    if (!this.token) return Promise.reject();
    const form = new FormData();
    form.append("smfile", fs.createReadStream(file));
    return await fetch(URL.upload, {
      method: "post",
      timeout: 0,
      headers: {
        ...form.getHeaders(),
        Authorization: this.token,
        "Content-Type": "multipart/form-data",
      },
      data: form,
    });
  }
}

let pictureHostServiceEntity = null;

module.exports = {
  pictureHostService: function () {
    if (pictureHostServiceEntity) return pictureHostServiceEntity;
    pictureHostServiceEntity = new PictureHostService();
    return pictureHostServiceEntity;
  },
};
