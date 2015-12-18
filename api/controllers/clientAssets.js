'use strict';

var express = require('express'),
    router  = express.Router(),
    authenticateClientToken = require('../middlewares/authenticateClientToken'),
    getClientId = require('../middlewares/getClientId'),
    Credit  = require('models').Credit,
    CreditApplication  = require('models').CreditApplication,
    Deposit  = require('models').Deposit,
    DepositApplication  = require('models').DepositApplication;


router.get('/:clientId/credits', authenticateClientToken, 
                                 getClientId, function(req, res, next) {
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

router.get('/:clientId/credit/applications', authenticateClientToken, 
                                             getClientId, function(req, res, next) {
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

router.get('/:clientId/deposits', authenticateClientToken, 
                                 getClientId, function(req, res, next) {
    var offset = +req.query.offset || 0,
        limit = +req.query.limit || 50;

    Deposit
        .findAll({ 
            offset: offset, 
            limit: limit,
            where: { client_id: req.clientId }
        })
        .then(function(deposits) {
            res.json({
                count: deposits.length,
                offset: offset,
                limit: limit,
                deposits: deposits
            });
        })
        .catch(function(error) {
            next(error);
        });
});

router.get('/:clientId/deposit/applications', authenticateClientToken, 
                                              getClientId, function(req, res, next) {
    var offset = +req.query.offset || 0,
        limit = +req.query.limit || 50;

    DepositApplication
        .findAll({ 
            offset: offset, 
            limit: limit,
            where: { client_id: req.clientId }
        })
        .then(function(depositApps) {
            res.json({
                count: depositApps.length,
                offset: offset,
                limit: limit,
                depositApps: depositApps
            });
        })
        .catch(function(error) {
            next(error);
        });
});

module.exports = router;
