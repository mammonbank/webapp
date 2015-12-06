'use strict';

var express = require('express'),
    router  = express.Router();

router.use('/auth', require('./auth'));

router.get('/', function(req, res, next) {
    res.sendFile('index.html', {
        root: 'bem/desktop.bundles/index/'
    });
});

router.get('/signup', function(req, res, next) {
    res.sendFile('signup.html', {
        root: 'bem/desktop.bundles/signup/'
    });
});

router.get('/dashboard', function(req, res, next) {
    res.sendFile('dashboard.html', {
        root: 'bem/desktop.bundles/dashboard/'
    });
});

module.exports = router;
