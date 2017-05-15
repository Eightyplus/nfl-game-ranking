const PKG = require('./package.json');
const BINPATH = './node_modules/nightwatch/bin/';

const config = {
  "src_folders": [
    "tests/nightwatch"
  ],
  "output_folder": "./reports",
  "selenium": {
    "start_process": true,
    "server_path": BINPATH + "selenium.jar",
    "host": "127.0.0.1",
    "port": 4444,
    "cli_args": {
      "webdriver.chrome.driver": BINPATH + "chromedriver"
    }
  },
  "test_settings": {
    "default": {
      "silent": true,
      "screenshots": {
        "enabled": true,
        "path": './screenshots'
      },
      "globals": {
        "waitForConditionTimeout": 5000
      },
      "desiredCapabilities": {
        "browserName": "chrome",
        "chromeOptions": {
          "args": [
            `Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46
            (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3`,
            "--window-size=640,1136" // iphone 5
          ]
        },
        "javascriptEnabled": true,
        "acceptSslCerts": true
      }
    },
  }
};

module.exports = config;

/**
 * Update Selenium & chromedriver
 */
require('fs').stat(BINPATH + 'selenium.jar', function (err, stat) { // got it?
  if (err || !stat || stat.size < 1) {
    require('selenium-download').ensure(BINPATH, function(error) {
      if (error) throw new Error(error); // no point continuing so exit!
      console.log('✔ Selenium & Chromedriver downloaded to:', BINPATH);
    });
  }
});
