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

if (process.env.NODE_ENV == 'watch' || process.env.NODE_ENV == 'test') {
  const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

  config.plugins = [
    new BrowserSyncPlugin(
      {
        host: 'localhost',
        port: 9090,
        proxy: 'http://localhost:8000'
      },
      {
        reload: true
      }
    ),
    //new ExtractTextPlugin("style.css")
  ];
} else {
  config.plugins = [
    //new ExtractTextPlugin("style.css"),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: true
      }
    })
  ]
}

module.exports = config;