'use strict';

var express = require('express'),
    path = require('path'),
    app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(require('./controllers'));

module.exports = app;
