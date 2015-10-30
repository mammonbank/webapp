'use strict';

var express = require('express'),
    app = express();

app.use(require('./controllers'));

app.use(require('error/handler/404_json'));
app.use(require('error/handler/api'));
app.use(require('error/handler'));

module.exports = app;
