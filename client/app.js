'use strict';

var express = require('express');
var config = require('config');
var path = require('path');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(require('./controllers'));

var server = app.listen(config.server.clientPort);