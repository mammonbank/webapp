'use strict';

var express = require('express'),
    router = express.Router();

router.get('/', function(req, res) {
    res.render('index.html');
});

router.get('/dashboard', function(req, res) {
    res.render('dashboard.html');
});

module.exports = router;
