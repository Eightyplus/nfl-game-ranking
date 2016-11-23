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
        delete stats[''];
        const matchups = util.calcMatchups(stats, matches);

        const keys = Object.keys(stats);
        assert.lengthOf(data, 1354, 'Number of players with fantasy stats');
        assert.lengthOf(keys, 32, 'Expect 32 teams this week' + Object.keys(stats));
        for (let key in keys) {
          let team = keys[key];
          let stat = stats[team];

          assert.notEqual(team, '');
          assert.isNotNull(team, undefined);

          function sortAsc(a, b) {
            if (a === b) {
              return 0;
            }
            else {
              return (a < b) ? -1 : 1;
            }
          }

          const positions = Object.keys(stat);

          assert.include(positions, 'DB');
          assert.include(positions, 'DEF');
          assert.include(positions, 'DL');
          assert.include(positions, 'K');
          assert.include(positions, 'LB');
          assert.include(positions, 'QB');
          assert.include(positions, 'RB');
          assert.include(positions, 'TE');
          assert.include(positions, 'WR');

          for (let i = 0; i < positions.length; i++) {
            let position = positions[i];
            let value = stat[position];
            assert.typeOf(value, 'number', 'Expected number for ' + team + ' at position ' + position);
          }
        }

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

describe('endpoint', function() {
  describe('get current week ranking', function() {
    it('be able to reach endpoint ranking', function(done) {
      const response = {
        s: null,
        h: null,
        w: null,

        status: (code) => { this.s = code; assert.equal(200, code)},
        header: (header) => { this.h = header; assert.typeOf(header, 'object')},
        write: (jsonStr) => { this.w = jsonStr; assert.typeOf(jsonStr, 'string')},
        end: () => {
          assert.equal(this.s, 200);
          assert.isNotNull(this.h);
          assert.isNotNull(this.w);
          done()
        },
        error: () => { assert.fail('No error should be called'); done() }
      };
      util.calcRanking({'url': '?no query params'}, response);
    });
  });
});
