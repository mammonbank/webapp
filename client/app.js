'use strict';

var express = require('express'),
    path = require('path'),
    config = require('config'),
    bodyParser = require('body-parser'),
    session = require('expreess-session'),
    passport = require('passport'),
    app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    name: 'mammonbank.sid',
    secret: config.security.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true 
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(require('./controllers'));

app.use(require('error/handler/404'));
app.use(require('error/handler/api'));
app.use(require('error/handler'));

module.exports = app;
