var http = require('http');
var path = require('path');
var express = require('express');
var app = express();
var util = require('./util');

app.get('/ranking', util.calcRanking);

app.use(express.static(__dirname + '/index'));

var server = http.createServer(app);

server.listen(process.env.PORT || 8000, process.env.IP || '127.0.0.1', function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});

