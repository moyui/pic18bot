const pixiv = "https://www.pixiv.net/";
const smms = "https://sm.ms/api/v2/";

module.exports = {
  rank: pixiv + "ranking.php",
  smms: {
    username: "moyui",
    password: "cS28672iH3eUfAB",
    api: {
        getToken: smms + 'token',
        getProfile: smms + 'profile',
        upload: smms + 'upload',
        createAlbum: smms + 'albums',
        getAlbum: smms + 'albums',
        getAlbumItems: smms + 'albums/'
    },
  },
};