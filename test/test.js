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


describe('Mapping team', function() {
  describe('mapTeam', function() {
    it('should map Packers to GB', function(done) {
      assert.equal(util.mapTeam('Packers'), 'GB');
      done()
    });
    it('should map Rams names to LS', function(done) {
      assert.equal(util.mapTeam('Rams'), 'LA');
      done()
    });
  });
});