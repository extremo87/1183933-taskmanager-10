const path = require(`path`);
const MomentLocalesPlugin = require(`moment-locales-webpack-plugin`);
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
    compress: true,
    watchContentBase: true
  },
  plugins: [
    // To strip all locales except “en”
    new MomentLocalesPlugin(),
  ],
};

