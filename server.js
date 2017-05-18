"use strict";

const http = require('http');
const path = require('path');
const express = require('express');
const app = express();
const util = require('./src/server/util');

const port = process.env.PORT || 8000;

app.get('/ranking', util.calcRanking);
app.get('/health', function(req, res) {
    res.send('OK');
});

app.use(express.static(__dirname + '/index'));

app.listen(port, function(){
    console.log('Server listening on port:' + port);
});
