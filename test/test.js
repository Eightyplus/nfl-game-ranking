let mocha = require('mocha');
let chai = require('chai');
const fs = require('fs');

const describe = mocha.describe;
const it = mocha.it;
const assert = chai.assert;
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


describe('Fantasy stats', function() {

  const matches = [
    ['MIA', 'CIN'],
    ['TB', 'DEN'],
    ['MIN', 'NYG'],
    ['JAX', 'IND'],
    ['BAL', 'OAK'],
    ['CHI', 'DET'],
    ['ATL', 'CAR'],
    ['WAS', 'CLE'],
    ['HOU', 'TEN'],
    ['ARI', 'LA'],
    ['SD', 'NO'],
    ['SF', 'DAL'],
    ['PIT', 'KC'],
    ['NYJ', 'SEA'],
    ['NE', 'BUF']
    // GB PHI
  ];

  describe('group stats for players', function() {
    it('Should be able to group into 5 players', function(done) {

      this.timeout(10000);
      callback = (matchups) => {
        assert.typeOf(matchups, 'array', 'Calculations returned in array');
        assert.lengthOf(matchups, 15, 'Expect 15 matches this week');

        done()
      };

      // skip this test, to slow!
      //util.calcWeek(4, matches, callback);

      fs.readFile('./test/stats_week4.json', function(error, str) {
        const data = JSON.parse(str)['players'];
        const stats = util.calcTeamStats(data);
        const matchups = util.calcMatchups(stats, matches);

        assert.lengthOf(data, 1354, 'Number of players with fantasy stats');
        assert.lengthOf(stats, 30, 'Expect 30 teams this week');

        callback(matchups);
      });
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