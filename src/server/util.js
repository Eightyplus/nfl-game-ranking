var http = require('http');
var url = require('url');
var scrapy = require('node-scrapy');
var util = require('./../common/util');

function isSeasonWeek(date) {
    var weekNumber = util.getWeekNumber(date)[1];
    if (0 <= weekNumber && weekNumber <= 5) {
        return weekNumber + 17; // postseason
    }
    if (36 <= weekNumber) {
        return weekNumber - 36;
    }
    return -1;
}

function getYearWeek(date, query) {
    var year = query.year;
    var week = query.week;

    var currentWeek = isSeasonWeek(date);
    var currentYear = date.getFullYear();
    var isSeason = currentWeek !== -1;
    if (isSeason && currentWeek > 17) {
        currentYear -= 1;
    }

    if (!util.isNumber(week) || !util.isNumber(year) || 
        year < 2000 ||
        year > currentYear ||
        year === currentYear && week > currentWeek) {
        return [0, 0, 'Invalid year/week combo: (' + year + '/' + week + ')'];
    }
    return [year, week]
}

function getUrl(year, week) {
    var weekPrefix = week !== 21 ? '/REG' : '/PRO';
    return 'http://www.nfl.com/scores/' + year + weekPrefix + week;
}

function calcRanking(req, res) {
    res.status(200);
    res.header({'Content-Type': 'application/json'});

    var query = url.parse(req.url, true).query;
    var show_score = typeof query.show_score !== 'undefined';

    var year, week, message;
    [year, week, message] = getYearWeek(new Date(), query);

    if (year === 0) {
      res.write(JSON.stringify({
        year: year,
        week: week,
        message: message,
      }));
      res.end();
      return;
    }

    var callback = function (matchups) {

        var matches = matchups['matchups'];
        var rankings = [];

        var fields = ['name', 'logo', 'score', 'qt1', 'qt2', 'qt3', 'qt4', 'qtot'];
        var qts = ['qt1', 'qt2', 'qt3', 'qt4', 'qtot'];
        for (var j = 0; j < matches.length; j++) {
            var away = matches[j]['away'];
            var home = matches[j]['home'];

            var total = away['score'] + home['score'];
            var diff = Math.abs(away['score'] - home['score']);
            var qt_diff = 0;
            for (var k = 0; k < qts.length; k++) {
                var qt = qts[k];
                qt_diff += Math.abs(away[qt] - home[qt]);
            }

            rankings.push({
                'away_name': away['name'],
                'home_name': home['name'],
                'away_logo': away['logo'],
                'home_logo': home['logo'],
                'ranking': total - 0.5 * qt_diff - 0.5 * diff,
                'game_score': {
                    'total': total,
                    'qt_diff': qt_diff,
                    'diff': diff,
                },
                'away_score': away['score'],
                'home_score': home['score'],
                'done': matches[j]['done'],
                'bigplays': matches[j]['bigplays']
            });
        }

        var sortDsc = function sortDsc(a, b) {
            var idx = 'ranking' ;
            if (a[idx] === b[idx]) {
                return 0;
            }
            else {
                return (a[idx] > b[idx]) ? -1 : 1;
            }
        };

        rankings.sort(sortDsc);

        res.write(JSON.stringify({
            year: year,
            week: week,
            rankings: rankings,
            unplayed: matchups['unplayed']
        }));
        res.end();

        /*
         var matchups = [];
         for (var j = 0; j < matches.length; j++) {
         var away = matches[j]['away']['name'];
         away = mapTeam(away);
         var home = matches[j]['home']['name'];
         home = mapTeam(home);
         matchups.push([away, home]);
         }

         calcWeek(week, matchups, function(matchups) {
         matchups.sort(sortDsc);
         var keys = Object.keys(matchups);

         for (var i in keys) {
         var key = keys[i];
         var value = matchups[i][0];

         if (show_score) {
         value += ' (' +matchups[i][1] + ')';
         }

         res.write(value + '\n');
         }
         res.end();
         });
         */
    };

    /* // debug
    callback = function(matches) {
        console.log(matches);
        res.write(matches);
        res.end();
    };*/

    fetchMatchups(year, week, callback);
}

//positions = positions.filter(function(item, i, ar){ return ar.indexOf(item) === i; });

function fetchMatchups(year, week, callback) {
    var url = getUrl(year, week);
    console.log('Scraping: ' + url);

    var model = {
        away: {
            logo: { selector: 'div.scorebox-wrapper:not(.pre) .away-team .team-logo', get: 'src'},
            name: { selector: 'div.scorebox-wrapper:not(.pre) .away-team .team-name'},
            score: {selector: 'div.scorebox-wrapper:not(.pre) .away-team .total-score'},
            qt1:  { selector: 'div.scorebox-wrapper:not(.pre) .away-team .first-qt', required: false},
            qt2:  { selector: 'div.scorebox-wrapper:not(.pre) .away-team .second-qt', required: false},
            qt3:  { selector: 'div.scorebox-wrapper:not(.pre) .away-team .third-qt', required: false},
            qt4:  { selector: 'div.scorebox-wrapper:not(.pre) .away-team .fourth-qt', required: false},
            qtot: { selector: 'div.scorebox-wrapper:not(.pre) .away-team .ot-qt', required: false},
        },
        home: {
            logo: { selector: 'div.scorebox-wrapper:not(.pre) .home-team .team-logo', get: 'src'},
            name: { selector: 'div.scorebox-wrapper:not(.pre) .home-team .team-name'},
            score: {selector: 'div.scorebox-wrapper:not(.pre) .home-team .total-score'},
            qt1: { selector:  'div.scorebox-wrapper:not(.pre) .home-team .first-qt', required: false},
            qt2: { selector:  'div.scorebox-wrapper:not(.pre) .home-team .second-qt', required: false},
            qt3: { selector:  'div.scorebox-wrapper:not(.pre) .home-team .third-qt', required: false},
            qt4: { selector:  'div.scorebox-wrapper:not(.pre) .home-team .fourth-qt', required: false},
            qtot: { selector: 'div.scorebox-wrapper:not(.pre) .home-team .ot-qt', required: false},
        },
        timeleft: { selector: 'div.scorebox-wrapper:not(.pre) .time-left', required: false},
        bigplays: { selector: 'div.scorebox-wrapper:not(.pre) .big-plays .big-plays-count', required: false},
        unplayed: {
            away: {
                logo: { selector: '.pre .away-team .team-logo', get: 'src'},
                name: { selector: '.pre .away-team .team-name a'},
            },
            home: {
                logo: {selector: '.pre .home-team .team-logo', get: 'src'},
                name: {selector: '.pre .home-team .team-name a'},
            }
        }
    };

    var matchups = [];
    scrapy.scrape(url, model, function(err, data) {
        if (err) return console.error(err);

        var away = data['away'];
        var home = data['home'];

        var fetchteam = function(arr, fields, numbers, index) {
            var result = {};
            for (var i = 0; i < fields.length; i++) {
                var field = fields[i];
                result[field] = arr[field][index];
                if (numbers[i]) {
                    var parsed = Number(result[field]);
                    if (util.isNumber(parsed)) {
                        result[field] = parsed;
                    } else {
                        console.log("NaN: " + result[field]);
                    }
                }
            }
            return result;
        };

        var fields = ['name', 'logo', 'score', 'qt1', 'qt2', 'qt3', 'qt4', 'qtot'];
        var numbers = [false, false, true, true, true, true, true, true];

        for (var i = 0; i < away['name'].length; i++) {
            matchups.push({
                'away': fetchteam(away, fields, numbers, i),
                'home': fetchteam(home, fields, numbers, i),
                'done': data['timeleft'][i]
            });
        }

        away = data['unplayed']['away'];
        home = data['unplayed']['home'];

        var unplayed = [];
        if (away['name'] != null) {
            if (typeof away['name'] === 'string' ) {
                unplayed.push({
                    'away': {
                        'name': away['name'],
                        'logo': away['logo'],
                    },
                    'home': {
                        'name': home['name'],
                        'logo': home['logo'],
                    },
                })
            } else {
                for (var j = 0; j < away['name'].length; j++) {
                    unplayed.push({
                        'away': fetchteam(away, ['name', 'logo'], j),
                        'home': fetchteam(home, ['name', 'logo'], j),
                    })
                }
            }
        }
        callback({matchups: matchups, unplayed: unplayed});
    });
}

function mapTeam(name) {
    var acrym = ['ARI',
        'ATL',
        'BAL',
        'BUF',
        'CAR',
        'CHI',
        'CIN',
        'CLE',
        'DAL',
        'DEN',
        'DET',
        'GB',
        'HOU',
        'IND',
        'JAX',
        'KC',
        'LA',
        'STL', // added to cover previous years
        'MIA',
        'MIN',
        'NE',
        'NO',
        'NYG',
        'NYJ',
        'OAK',
        'PHI',
        'PIT',
        'SD',
        'SEA',
        'SF',
        'TB',
        'TEN',
        'WAS'];

    var names = ['Cardinals',
        'Falcons',
        'Ravens',
        'Bills',
        'Panthers',
        'Bears',
        'Bengals',
        'Browns',
        'Cowboys',
        'Broncos',
        'Lions',
        'Packers',
        'Texans',
        'Colts',
        'Jaguars',
        'Chiefs',
        'Rams',
        'Rams',
        'Dolphins',
        'Vikings',
        'Patriots',
        'Saints',
        'Giants',
        'Jets',
        'Raiders',
        'Eagles',
        'Steelers',
        'Chargers',
        'Seahawks',
        '49ers',
        'Buccaneers',
        'Titans',
        'Redskins'];
    //var teams = [];
    for (var i = 0; i < acrym.length; i++) {
        //teams[acrym[i]] = names[i];
        if (name === names[i]) {
            //console.log(name + ' found, returning ' + acrym[i]);
            return acrym[i];
        }
    }
    console.log("No acrym found for: " + name);
    return undefined;
}

function calcWeek(week, matches, callback) {
    var options = {
        host: 'api.fantasy.nfl.com',
        path: '/v1/players/stats?statType=seasonStats&season=2016&week=' + week + '&format=json',
        method: 'GET'
    };

    http.request(options, function(response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function() {
            var data = JSON.parse(str)['players'];
            var stats = calcTeamStats(data);
            var matchups = calcMatchups(stats, matches);
            callback(matchups);
        });
    }).end();
}

function sortAsc(a, b) {
    var idx = 1; //'name' ;
    if (a[idx] === b[idx]) {
        return 0;
    }
    else {
        return (a[idx] < b[idx]) ? -1 : 1;
    }
}

function sortDsc(a, b) {
    var idx = 1; //'name' ;
    if (a[idx] === b[idx]) {
        return 0;
    }
    else {
        return (a[idx] > b[idx]) ? -1 : 1;
    }
}


function calcTeamStats(data) {
    var teamStats = [];
    var keys = Object.keys(data);

    for (var i=0; i < keys.length; i++) {
        var key = keys[i];
        var player = data[key];
        var team = player['teamAbbr'];
        var position = player['position'];

        if (! (team in teamStats) ) {
            teamStats[team]=[];
        }
        if (! (position in teamStats[team]) ) {
            teamStats[team][position] = 0;
        }

        teamStats[team][position] += player['weekPts'];
    }

    return teamStats;
}

function calcMatchups(stats, games) {

    var scores = [];

    for (var i in games) {
        var game = games[i];

        var team1 = game[0];
        var team2 = game[1];

        var sum1 = sum(stats, team1);
        var sum2 = sum(stats, team2);

        var diff = Math.abs(sum1) - Math.abs(sum2);
        var com = Math.abs(sum1) + Math.abs(sum2);
        var score = com - Math.abs(diff);

        var name = team1 + " vs " + team2;
        scores.push([name, score]);

        console.log(name + ": " + score);
    }
    return scores;
}

function sum(stats, team) {
    var sum = 0;
    var teamStats = stats[team];
    if (teamStats == undefined) {
        console.log("Team not found: " + team);
        return 0;
    }

    var keys = Object.keys(teamStats);
    for (var i in keys) {
        var key = keys[i];
        var stat = teamStats[key];
        if (stat > 0) {
            sum += stat;
        }
    }

    return sum;
}

exports.isSeasonWeek = isSeasonWeek;
exports.getYearWeek = getYearWeek;
exports.getUrl = getUrl;

exports.fetchMatchups = fetchMatchups;
exports.mapTeam = mapTeam;
exports.calcWeek = calcWeek;
exports.sortAsc = sortAsc;
exports.sortDsc = sortDsc;
exports.calcTeamStats = calcTeamStats;
exports.calcMatchups = calcMatchups;
exports.sum = sum;