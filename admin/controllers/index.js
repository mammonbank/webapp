'use strict';

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('index', { message: 'Hello, admin!' });
});

module.exports = router;
