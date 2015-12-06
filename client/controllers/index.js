'use strict';

var express = require('express'),
    router  = express.Router();

router.use('/auth', require('./auth'));  

router.get('/', function(req, res, next) {
    res.render('index');
});

module.exports = router;
