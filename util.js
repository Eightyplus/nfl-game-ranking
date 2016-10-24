var http = require('http');
var url = require('url');
var scrapy = require('node-scrapy');
var util = require('./index/util');

function calcRanking(req, res) {
    res.status(200);
    res.header({'Content-Type': 'application/json'});

    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var show_score = typeof query.show_score !== 'undefined';

    var year = query.year;
    if (!util.isNumber(year)) {
        year = new Date().getFullYear()
    }

    var weekNumber = util.getWeekNumber()[1] - 36;
    var week = query.week;
    if (!util.isNumber(week) || week > weekNumber) {
        console.log("Defaults to week " + weekNumber);
        week = weekNumber;
    }

    var callback = function (matches) {

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
                'ranking': total - 0.5 * qt_diff - 1.5 * diff,
                'game_score': {
                    'total': total,
                    'qt_diff': qt_diff,
                    'diff': diff,
                },
                'away_score': away['score'],
                'home_score': home['score'],
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
            rankings: rankings
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

    fetchMatchups(year, week, callback);
}

//positions = positions.filter(function(item, i, ar){ return ar.indexOf(item) === i; });

function fetchMatchups(year, week, callback) {
    var url = 'http://www.nfl.com/scores/'+ year + '/REG' + week;
    console.log('Scraping: ' + url);

    var model = {
        away: {
            logo: { selector: '.away-team .team-logo', get: 'src'},
            name: { selector: '.away-team .team-data .team-info .team-name'},
            score: { selector: '.away-team .total-score'},
            qt1: { selector: '.away-team .first-qt'},
            qt2: { selector: '.away-team .second-qt'},
            qt3: { selector: '.away-team .third-qt'},
            qt4: { selector: '.away-team .fourth-qt'},
            qtot: { selector: '.away-team .ot-qt'},
        },
        home: {
            logo: { selector: '.home-team .team-logo', get: 'src'},
            name: { selector: '.home-team .team-data .team-info .team-name'},
            score: { selector: '.home-team .total-score'},
            qt1: { selector: '.home-team .first-qt'},
            qt2: { selector: '.home-team .second-qt'},
            qt3: { selector: '.home-team .third-qt'},
            qt4: { selector: '.home-team .fourth-qt'},
            qtot: { selector: '.home-team .ot-qt'},
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
                    result[field] = Number(result[field]);
                }
            }
            return result;
        };

        var fields = ['name', 'logo', 'score', 'qt1', 'qt2', 'qt3', 'qt4', 'qtot'];
        var numbers = [false, false, true, true, true, true, true, true];

        for (var i = 0; i < away['name'].length; i++) {
            matchups.push({
                'away': fetchteam(away, fields, numbers, i),
                'home': fetchteam(home, fields, numbers, i)
            });
        }

        callback(matchups);
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

exports.calcRanking = calcRanking;