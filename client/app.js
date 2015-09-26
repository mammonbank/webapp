'use strict';

var express = require('express');
var config = require('config');
var app = express();

app.get('/', function (req, res) {
    res.send('Hello, Mammon-client!\n');
});

var server = app.listen(config.server.clientPort);
