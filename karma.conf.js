
module.exports = function(config) {
  config.set({
    autoWatch: true,
    browsers: ['Firefox'],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    singleRun: false,
    concurrency: Infinity,
    basePath: '',
    frameworks: ['mocha', 'sinon'],
    files: [
      'tests.webpack.js',
    ],
    exclude: [
    ],
    preprocessors: {
      'tests.webpack.js': [ 'webpack', 'sourcemap' ] //preprocess with webpack and our sourcemap loader
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
