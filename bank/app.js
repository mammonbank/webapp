'use strict';

var express = require('express'),
    path = require('path'),
    app = express(),
    favicon = require('serve-favicon');

app.use(favicon(path.join(__dirname, 'favicon.ico')));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'html'));
app.engine('html', require('ejs').renderFile);

app.use(require('./controllers'));

module.exports = app;
