'use strict';

var express = require('express'),
    router  = express.Router(),
    authenticateOverseerToken = require('../middlewares/authenticateOverseerToken'),
    prepareUpdateObject = require('../middlewares/prepareUpdateObject'),
    BankInfo  = require('models').BankInfo,
    Sequelize = require('sequelize'),
    HttpApiError = require('error').HttpApiError;

router.get('/', authenticateOverseerToken, function(req, res, next) {
    BankInfo
        .findById(1)
        .then(function(bankInfo) {
            res.json({
                baseMoney: bankInfo.baseMoney,
                moneySupply: bankInfo.moneySupply,
                reserveRatio: bankInfo.reserveRatio
            });
        })
        .catch(function(error) {
            next(error);
        });
});

router.post('/', authenticateOverseerToken, function(req, res, next) {
    BankInfo
        .create({
            baseMoney: req.body.baseMoney,
            moneySupply: req.body.moneySupply,
            reserveRatio: req.body.reserveRatio
        })
        .then(function(bankInfo) {            
            res.json({
                success: true
            });
        })
        .catch(Sequelize.ValidationError, function(error) {
            next(new HttpApiError(400, error.message));
        })
        .catch(function(error) {
            next(error);
        });
});

router.patch('/', authenticateOverseerToken, prepareUpdateObject, function(req, res, next) {
    BankInfo
        .update(req.updateObj, {
            where: {
                id: 1
            }
        })
        .then(function() {
            res.json({
                updated: true
            });
        })
        .catch(Sequelize.ValidationError, function(error) {
            next(new HttpApiError(400, error.message));
        })
        .catch(function(error) {
            next(error);
        });
});

module.exports = router;
