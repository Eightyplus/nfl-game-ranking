"use strict";

const http = require('http');
const path = require('path');
const express = require('express');
const app = express();
const util = require('./src/server/util');

app.get('/ranking', util.calcRanking);

app.use(express.static(__dirname + '/index'));

const server = http.createServer(app);

server.listen(process.env.PORT || 8000, process.env.IP || '127.0.0.1', function(){
  let addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});

