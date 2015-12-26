'use strict';

var express = require('express'),
    favicon = require('serve-favicon'),
    bodyParser = require('body-parser'),
    app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static('client/bem/desktop.bundles/'));
app.use(express.static('client/bem/'));
app.use(favicon(__dirname + '/favicon.ico'));

app.use(require('./controllers'));

app.use(require('error/handler/404'));
app.use(require('error/handler/api'));
app.use(require('error/handler/500'));

module.exports = app;

