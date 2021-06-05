const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const MODE = process.env.WEBPACK_ENV;
const BASEURL_JS = "./assets/js/";
const ENTRY_FILES = {
  main: `${BASEURL_JS}main.js`,
  videoPlayer: `${BASEURL_JS}videoPlayer.js`,
  videoRecorder: `${BASEURL_JS}videoRecorder.js`,
  addComment: `${BASEURL_JS}addComment.js`,
};
const OUTPUT_DIR = path.join(__dirname, "static");

const config = {
  entry: ENTRY_FILES,
  mode: MODE,
  output: {
    path: OUTPUT_DIR,
    filename: "[name].js",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js)$/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
      {
        test: /\.(scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
    ],
  },
};

module.exports = config;
