'use strict';

var express = require('express');
var path = require('path');
var config = require('config');
var bodyParser = require('body-parser');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());

app.use(require('./controllers'));

app.listen(config.server.clientPort);
