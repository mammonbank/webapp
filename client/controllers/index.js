'use strict';

var express = require('express'),
    router  = express.Router();

//router.use('/auth', require('./auth'));

router.get('*', function(req, res, next) {
    res.render('index');
});

/*
router.get('/register', function(req, res, next) {
    res.render('register');
});
*/

module.exports = router;
