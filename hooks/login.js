const cheerio = require("cheerio");
const consola = require("consola");
const qs = require("qs");
const fs = require("fs");
const config = require("../config/index").login;

const { fetch } = require("../utils/fetch");

const { url, api, id, password } = config;

const getKey = () => {
  return fetch(url)
    .then((res) => {
      const $ = cheerio.load(res.data);
      const post_key = $('input[name="post_key"]').val();
      const cookie = res.headers["set-cookie"].join("; ");
      if (post_key && cookie) {
        return { post_key, cookie };
      }
      return Promise.reject("no post_key");
    })
    .catch((error) => {
      consola.error("getPostKey error", error);
      return Promise.reject(error);
    });
};

const postLogin = (post_key, cookie) => {
  return fetch(api, {
    method: "post",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Origin: "https://accounts.pixiv.net",
      Referer:
        "https://accounts.pixiv.net/login?lang=zh&source=pc&view_type=page&ref=wwwtop_accounts_index",
      "X-Requested-With": "XMLHttpRequest",
      Cookie: cookie,
    },
    data: qs.stringify({
      pixiv_id: id,
      password: password,
      captcha: "",
      g_recaptcha_response: "",
      post_key: post_key,
      source: "pc",
      ref: "wwwtop_accounts_index",
      return_to: "http://www.pixiv.net/"
    }),
  })
    .then((response) => {
      console.log('pixivlogin', response);
      if (response.headers["set-cookie"]) {
        const cookie = response.headers["set-cookie"].join(" ;");
        consola.log("postLogin cookie", cookie);
        return cookie;
      } else {
        return Promise.reject(new Error("no cookie"));
      }
    })
    .catch((error) => {
      consola.error(error);
    });
};

const loginHooks = async () => {
  const { post_key, cookie } = await getKey();
  const userCookie = await postLogin(post_key, cookie);
  if (userCookie) {
    fs.writeFileSync("cookie.txt", userCookie);
  }
  return userCookie;
};

module.exports = loginHooks;
