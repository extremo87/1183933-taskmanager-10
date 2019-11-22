const path = require(`path`);
const docRoot = path.join(__dirname, `public`);
module.exports = {
  mode: `production`,
  entry: `./src/main.js`,
  output: {
    filename: `bundle.js`,
    path: docRoot
  }
};

