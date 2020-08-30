const fs = require("fs");

const writeFileRecursive = (path, buffer, callback) => {
  let lastPath = path.substring(0, path.lastIndexOf("/"));
  fs.mkdir(lastPath, { recursive: true }, (err) => {
    if (err) return callback(err);
    fs.writeFile(path, buffer, function (err) {
      if (err) return callback(err);
      return callback(null);
    });
  });
};

module.exports = {
  writeFileRecursive,
};
