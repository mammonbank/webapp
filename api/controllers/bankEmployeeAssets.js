'use strict';

var express = require('express'),
    router  = express.Router(),
    authenticateOperatorToken = require('../middlewares/authenticateOperatorToken'),
    getBankEmployeeId = require('../middlewares/getBankEmployeeId'),
    CreditApplication  = require('models').CreditApplication,
    DepositApplication  = require('models').DepositApplication;


router.get('/:bankEmployeeId/credit/applications', authenticateOperatorToken,
    getBankEmployeeId, function(req, res, next) {
        var offset = +req.query.offset || 0,
            limit = +req.query.limit || 50;

        CreditApplication
            .findAll({
                offset: offset,
                limit: limit,
                where: { bank_employee_id: req.bankEmployeeId }
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

router.get('/:bankEmployeeId/archives/credit/applications', authenticateOperatorToken,
    getBankEmployeeId, function(req, res, next) {
        var offset = +req.query.offset || 0,
            limit = +req.query.limit || 50;

        CreditApplication
            .findAll({
                offset: offset,
                limit: limit,
                paranoid: false,
                where: {
                    bank_employee_id: req.bankEmployeeId,
                    deleted_at: {
                        $ne: null
                    }
                }
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

router.get('/:bankEmployeeId/deposit/applications', authenticateOperatorToken,
    getBankEmployeeId, function(req, res, next) {
        var offset = +req.query.offset || 0,
            limit = +req.query.limit || 50;

        DepositApplication
            .findAll({
                offset: offset,
                limit: limit,
                where: { bank_employee_id: req.bankEmployeeId }
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

router.get('/:bankEmployeeId/archives/deposit/applications', authenticateOperatorToken,
    getBankEmployeeId, function(req, res, next) {
        var offset = +req.query.offset || 0,
            limit = +req.query.limit || 50;

        DepositApplication
            .findAll({
                offset: offset,
                limit: limit,
                paranoid: false,
                where: {
                    bank_employee_id: req.bankEmployeeId,
                    deleted_at: {
                        $ne: null
                    }
                }
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
