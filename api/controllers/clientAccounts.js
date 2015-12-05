'use strict';

var express = require('express'),
    router  = express.Router(),
    //authenticateToken = require('../middlewares/authenticateToken'),
    prepareUpdateObject = require('../middlewares/prepareUpdateObject'),
    getClientId = require('../middlewares/getClientId'),
    ClientAccount  = require('models').ClientAccount,
    Sequelize = require('models').Sequelize,
    HttpApiError = require('error').HttpApiError;

router.get('/accounts/all', getClientId, function(req, res, next) {
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

router.get('/:clientId/account', getClientId, function(req, res, next) {
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

router.patch('/:clientId/account', getClientId, prepareUpdateObject, function(req, res, next) {
    ClientAccount
        .update(req.updateObj, { 
            where: { client_id: req.clientId }
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