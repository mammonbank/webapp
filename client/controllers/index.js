'use strict';

var express = require('express'),
    router  = express.Router();

router.get('/', function(req, res, next) {
    res.sendFile('index.html', {
        root: 'client/bem/desktop.bundles/index/'
    });
});

router.get('/signup', function(req, res, next) {
    res.sendFile('signup.html', {
        root: 'client/bem/desktop.bundles/signup/'
    });
});

router.get('/dashboard', function(req, res, next) {
    res.sendFile('dashboard.html', {
        root: 'client/bem/desktop.bundles/dashboard/'
    });
});

module.exports = router;
