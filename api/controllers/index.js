'use strict';

var express = require('express'),
    router = express.Router();

router.use('/api/clients', require('./clients'));

//NOTE: future: /api/clients/:clientId/credit/applications endpoints

router.use('/api/credit/applications', require('./creditApplications'));
router.use('/api/credit/categories', require('./creditCategories'));
router.use('/api/credit/types', require('./creditTypes'));
router.use('/api/credits', require('./credits'));

router.get('/', function(req, res) {
    res.json({
        message: 'Welcome to the mammonbank api server'
    });
});

module.exports = router;
