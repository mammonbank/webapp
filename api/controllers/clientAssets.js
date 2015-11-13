'use strict';

var express = require('express'),
    router  = express.Router(),
    //authenticateToken = require('../middlewares/authenticateToken'),
    getClientId = require('../middlewares/getClientId'),
    Credit  = require('models').Credit,
    CreditApplication  = require('models').CreditApplication;


router.get('/:clientId/credits', getClientId, function(req, res, next) {
    var offset = +req.query.offset || 0,
        limit = +req.query.limit || 50;

    Credit
        .findAll({ 
            offset: offset, 
            limit: limit,
            where: { client_id: req.clientId }
        })
        .then(function(credits) {
            res.json({
                count: credits.length,
                offset: offset,
                limit: limit,
                credits: credits
            });
        })
        .catch(function(error) {
            next(error);
        });
});

router.get('/:clientId/credit/applications', getClientId, function(req, res, next) {
    var offset = +req.query.offset || 0,
        limit = +req.query.limit || 50;

    CreditApplication
        .findAll({ 
            offset: offset, 
            limit: limit,
            where: { client_id: req.clientId }
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
