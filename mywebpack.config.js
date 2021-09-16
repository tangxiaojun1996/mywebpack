const path = require("path");

module.exports = {
  entry: path.join(__dirname, "./src/index.js"),
  output: {
    path: path.join(__dirname, "./dist"),
    filename: "bundle.js",
  },
  loaders: [path.resolve(__dirname, "./webpack/MyLoader.js")],
};
