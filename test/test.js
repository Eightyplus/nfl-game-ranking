const assert = require('chai').assert;
const util = require('../util');

describe('Fetching stats', function() {
  describe('#fetch()', function() {
    it('should be able to fetch stats from nfl.com', function(done) {
      callback = function (data) {
        assert.typeOf(data, 'object', 'Scraped data is a dictionary (object)');
        assert.lengthOf(data.matchups, 16, 'Expect 16 matchups');
        done();
      };

      util.fetchMatchups(2016, 1, callback);
    });
  });
});
