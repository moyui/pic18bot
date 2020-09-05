const smmsConfig = require("../config").smms;
const pixivConfig = require('../config').pixiv;

const pixiv = "https://www.pixiv.net/";
const smms = "https://sm.ms/api/v2/";

module.exports = {
  rank: pixiv + "ranking.php",
  login: {
    url: 'https://accounts.pixiv.net/login?lang=zh&source=pc&view_type=page&ref=wwwtop_accounts_index',
    api: 'https://accounts.pixiv.net/api/login?lang=zh',
    id: pixivConfig.id,
    password: pixivConfig.password
  },
  smms: Object.assign(
    {
      username: "",
      password: "",
      api: {
        getToken: smms + "token",
        getProfile: smms + "profile",
        upload: smms + "upload",
        createAlbum: smms + "albums",
        getAlbum: smms + "albums",
        getAlbumItems: smms + "albums/",
      },
    },
    smmsConfig
  ),
};
