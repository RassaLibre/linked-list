const path = require('path');

module.exports = {
  entry: {
    'library': './src/index.js',
    'example': './example/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: "#inline-source-map",
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
  }
};
