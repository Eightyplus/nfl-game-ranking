const path = require('path');
const webpack = require('webpack');

const BUILD_DIR = path.resolve(__dirname, 'index');
const APP_DIR = path.resolve(__dirname, 'src/app');

const config = {
  entry: APP_DIR + '/main.js',
  output: {
    path: BUILD_DIR,
    filename: 'index.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include : APP_DIR,
        loader: 'babel-loader'
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
};


module.exports = config;