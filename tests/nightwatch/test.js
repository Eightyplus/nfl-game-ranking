/*module.exports = {
  'Demo test Google' : function (client) {
    client
      .url('http://www.google.com')
      .waitForElementVisible('body', 1000)
      .assert.title('Google')
      .assert.visible('input[type=text]')
      .setValue('input[type=text]', 'rembrandt van rijn')
      .waitForElementVisible('button[name=btnG]', 1000)
      .click('button[name=btnG]')
      .pause(1000)
      .assert.containsText('div#search h3.r:first-child a', 'Rembrandt - Wikipedia')
      .end();
  }
};
*/

module.exports = {
  'Eightyplus.dk' : function (client) {
    client
      .url('http://www.eightyplus.dk')
      .waitForElementVisible('body', 5000)
      .assert.title('NFL App Ranking')
      .waitForElementVisible('.container', 5000)
      .waitForElementVisible('.arrow', 5000)
      .assert.visible('.arrow:first-child')
      .assert.containsText('.arrow a', '<')
      .click('.arrow:first-child a')
      .pause(1000)
      .waitForElementVisible('.arrow', 5000)
      .assert.visible('.arrow:first-child')
      .assert.visible('.arrow:last-child')
      .assert.containsText('.arrow:first-child a', '<')
      .assert.containsText('.arrow:last-child a', '>')
      .url('https://eightyplus.dk/?year=2016&week=1')
      .waitForElementVisible('.arrow', 5000)
      .assert.containsText('.header', '2016, Week 1')
      //.assert.containsText('.arrow:first-child a', '>')
      .end();
  }
};