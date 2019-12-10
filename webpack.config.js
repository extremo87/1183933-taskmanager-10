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

    // Or: To strip all locales except “en”, “es-us” and “ru”
    // (“en” is built into Moment and can’t be removed)
    new MomentLocalesPlugin({
      localesToKeep: [`en`],
    }),
  ],
};

