var http = require('http');
var url = require('url');
var calcRanking = require('./util');

http.createServer(calcRanking).listen(8000);

