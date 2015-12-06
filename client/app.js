'use strict';

var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(require('./controllers'));

app.use(require('error/handler/404'));
app.use(require('error/handler/api'));
app.use(require('error/handler/500'));

module.exports = app;

