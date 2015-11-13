'use strict';

var express = require('express'),
    router  = express.Router(),
    //authenticateToken = require('../middlewares/authenticateToken'),
    getClientId = require('../middlewares/getClientId'),
    CreditApplication  = require('models').CreditApplication;


router.get('/', getClientId, function(req, res, next) {
    var offset = +req.query.offset || 0,
        limit = +req.query.limit || 50;

    CreditApplication
        .findAll({ 
            offset: offset, 
            limit: limit,
            client_id: req.clientId 
        })
        .then(function(creditApps) {
            res.json({
                count: creditApps.length,
                offset: offset,
                limit: limit,
                creditApps: creditApps
            });
        })
        .catch(function(error) {
            next(error);
        });
});

module.exports = router;
