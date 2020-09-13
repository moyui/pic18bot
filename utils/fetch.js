const request = require("axios");
const fs = require("fs");
const SocksProxyAgent = require("socks-proxy-agent");
const consola = require("consola");

const config = {
  method: "get",
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
    "Accept-Encoding": "gzip",
  },
  timeout: 3000,
};

const httpsAgent = new SocksProxyAgent("socks://127.0.0.1:1080");

const fetch = (url, options = {}) => {
  const { needCookie = true, needProxy = true } = options;

  const base = {
    url,
  };

  if (needProxy) {
    base.httpsAgent = httpsAgent;
  }

  options = Object.assign({}, config, options, base);

  if (needCookie && fs.existsSync("cookie.txt")) {
    options.headers["Cookie"] = fs.readFileSync("cookie.txt", "utf8");
  }

  return new Promise((resolve, reject) => {
    request(options)
      .then((res) => {
        return resolve(res);
      })
      .catch((error) => {
        consola.error(error);
        return reject(error);
      });
  });
};

module.exports = {
  fetch,
};
