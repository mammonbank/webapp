'use strict';

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(require('./middlewares/allowCrossOrigin'));
app.use(require('./controllers'));

app.use(require('error/handler/404_json'));
app.use(require('error/handler/api'));
app.use(require('error/handler/500_json'));

module.exports = app;
