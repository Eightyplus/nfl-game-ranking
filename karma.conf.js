
module.exports = function(config) {
  config.set({
    autoWatch: true,
    browsers: ['Firefox'],
    reporters: ['progress'],
    colors: true,
    logLevel: config.LOG_INFO,
    singleRun: false,
    concurrency: Infinity,
    basePath: '',
    frameworks: ['mocha', 'sinon'],
    files: [
      'tests.webpack.js',
      {pattern: 'src/test/*.json', included: false, served: true, watched: false, nocache: true}
    ],
    exclude: [
    ],
    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap' ] //preprocess with webpack and our sourcemap loader
    },
    proxies: {
      '/ranking': 'http://' + config.hostname + ':'+ config.port + '/base/src/test/http_localhost_8000_rankingweek4.json'
    },
    webpack: { //kind of a copy of your webpack config
      devtool: 'inline-source-map', //just do inline source maps instead of the default
      module: {
        loaders: [
          {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
          },
          {
            test: /\.json$/,
            loader: 'json-loader'
          }
        ]
      }
    },
  })
};
