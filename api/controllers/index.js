'use strict';

var express = require('express'),
    router = express.Router();

router.use('/api/clients', require('./clients'));   

router.get('/', function(req, res) {
    res.json({
        message: 'Welcome to the mammonbank api server'
    });
});

module.exports = router;
