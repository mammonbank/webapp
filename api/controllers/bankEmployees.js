'use strict';

var express = require('express'),
    router  = express.Router(),
    authenticateOverseerToken = require('../middlewares/authenticateOverseerToken'),
    authenticateOperatorToken = require('../middlewares/authenticateOperatorToken'),
    prepareUpdateObject = require('../middlewares/prepareUpdateObject'),
    getBankEmployeeId = require('../middlewares/getBankEmployeeId'),
    BankEmployee  = require('models').BankEmployee,
    Sequelize = require('models').Sequelize,
    HttpApiError = require('error').HttpApiError;

router.get('/', authenticateOverseerToken, function(req, res, next) {
    var offset = +req.query.offset || 0,
        limit = +req.query.limit || 50;

    BankEmployee
        .findAll({ offset: offset, limit: limit })
        .then(function(bankEmployees) {
            res.json({
                count: bankEmployees.length,
                offset: offset,
                limit: limit,
                bankEmployees: bankEmployees
            });
        })
        .catch(function(error) {
            next(error);
        });
});

router.get('/', authenticateOverseerToken, function(req, res, next) {
    var offset = +req.query.offset || 0,
        limit = +req.query.limit || 50,
        bankEmployeeType = req.query.type;

    BankEmployee
        .findAll({ offset: offset, limit: limit, where: { type: bankEmployeeType } })
        .then(function(bankEmployees) {
            res.json({
                count: bankEmployees.length,
                offset: offset,
                limit: limit,
                bankEmployees: bankEmployees
            });
        })
        .catch(function(error) {
            next(error);
        });
});

router.get('/:bankEmployeeId', authenticateOperatorToken,
                               getBankEmployeeId, function(req, res, next) {
    BankEmployee
        .findById(req.bankEmployeeId)
        .then(function(bankEmployee) {
            if (!bankEmployee) {
                return res.json({
                    message: 'No bank employee has been found with given id'    
                });
            }
            
            res.json(bankEmployee);
        })
        .catch(function(error) {
            next(error);
        });
});

router.post('/', authenticateOverseerToken, function(req, res, next) {
    BankEmployee
        .create({
            username: req.body.username,
            password: req.body.password,
            type: req.body.type,
            numberOfApplications: 0
        })
        .then(function(bankEmployee) {            
            res.json({
                bankEmployee: bankEmployee.id
            }); 
        })
        .catch(Sequelize.ValidationError, function(error) {
            next(new HttpApiError(400, error.message));
        })
        .catch(function(error) {
            next(error);
        });
});

router.patch('/:bankEmployeeId', authenticateOverseerToken, 
                                 getBankEmployeeId, 
                                 prepareUpdateObject, function(req, res, next) {
    BankEmployee
        .update(req.updateObj, {
            where: {
                id: req.bankEmployeeId
            },
            individualHooks: true
        })
        .then(function() {
            res.json({
                updated: req.bankEmployeeId
            });
        })
        .catch(Sequelize.ValidationError, function(error) {
            next(new HttpApiError(400, error.message));
        })
        .catch(function(error) {
            next(error);
        });
});

router.delete('/:bankEmployeeId', authenticateOverseerToken, 
                                  getBankEmployeeId, function(req, res, next) {
    BankEmployee
        .destroy({
            where: { id: req.bankEmployeeId }
        })
        .then(function() {
            res.json({
                bankEmployeeId: req.bankEmployeeId
            });
        })
        .catch(function(error) {
            next(error);
        });
});

module.exports = router;
