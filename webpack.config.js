"use strict";

const path = require(`path`);
const docRoot = path.join(__dirname, `public`);
module.exports = {
  mode: `development`,
  entry: `./src/main.js`,
  output: {
    filename: `bundle.js`,
    path: docRoot
  },
  devtool: `source-map`,
  devServer: {
    contentBase: docRoot,
    publicPath: `http:/localhost:8080/`,
    compress: true,
    watchContentBase: true
  }
};

