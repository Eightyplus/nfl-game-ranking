const path = require('path');
const webpack = require('webpack');

const BUILD_DIR = path.resolve(__dirname, 'index');
const APP_DIR = path.resolve(__dirname, 'src/app');

const config = {
  entry: ['whatwg-fetch', APP_DIR + '/main.js'],
  output: {
    path: BUILD_DIR,
    filename: 'index.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        include : APP_DIR,
        loader: 'babel-loader',
        exclude: [
          /node_modules/,
          '*-test.js'
          ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
};


module.exports = config;