'use strict';

var express = require('express'),
    router  = express.Router();

router.use('/api/clients', require('./clients'));

router.get('/', function(req, res) {
    res.render('index', { message: 'Hello, client!' });
});

module.exports = router;
