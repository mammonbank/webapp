'use strict';

var express = require('express'),
    router  = express.Router(),
    authenticateClientToken = require('../middlewares/authenticateClientToken'),
    getClientId = require('../middlewares/getClientId'),
    ClientAccount  = require('models').ClientAccount,
    HttpApiError = require('error').HttpApiError;

router.get('/', authenticateClientToken, function(req, res, next) {
    var offset = +req.query.offset || 0,
        limit = +req.query.limit || 50;

    ClientAccount
        .findAll({ offset: offset, limit: limit })
        .then(function(clientAccounts) {
            res.json({
                clientAccounts: clientAccounts
            });
        })
        .catch(function(error) {
            next(error);
        });
});

router.get('/:clientId', authenticateClientToken, getClientId, function(req, res, next) {
    ClientAccount
        .findOne({ 
            where: { client_id: req.clientId }
        })
        .then(function(clientAccount) {
            if (!clientAccount) {
                return res.json({
                    message: 'No client account has been found with given client id'    
                });
            }
            
            res.json({
                clientAccount: clientAccount
            });
        })
        .catch(function(error) {
            next(error);
        });
});

router.post('/:clientId/deposit', authenticateClientToken, getClientId, function(req, res, next) {
    var sum = +req.body.sum;
    if (!sum || sum <= 0) {
        return next(new HttpApiError(400, 'Invalid sum'));
    }
    
    ClientAccount
        .findOne({
            where: { client_id: req.clientId }
        })
        .then(function(clientAccount) {
            if (!clientAccount) {
                return res.json({
                    message: 'No client account has been found with given client id'
                });
            }
            
            clientAccount.deposit(sum, function(error, amount) {
                if (error) {
                    return next(error);
                }
                
                res.json({
                    amount: amount
                });
            }); 
        });
});

router.post('/:clientId/withdraw', authenticateClientToken, getClientId, function(req, res, next) {
    var sum = +req.body.sum;
    if (!sum || sum <= 0) {
        return next(new HttpApiError(400, 'Invalid sum'));
    }
    
    ClientAccount
        .findOne({
            where: { client_id: req.clientId }
        })
        .then(function(clientAccount) {
            if (!clientAccount) {
                return res.json({
                    message: 'No client account has been found with given client id'
                });
            }
            
            clientAccount.withdraw(sum, function(error, amount) {
                if (error) {
                    return next(error);
                }
                
                res.json({
                    amount: amount
                });
            }); 
        });
});


module.exports = router;
