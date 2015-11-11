'use strict';

var express = require('express'),
    router  = express.Router(),
    //authenticateToken = require('../middlewares/authenticateToken'),
    getCreditAppId = require('../middlewares/getCreditAppId'),
    CreditApplication  = require('models').CreditApplication,
    Sequelize = require('sequelize'),
    HttpApiError = require('error').HttpApiError;

router.get('/', function(req, res, next) {
    var offset = +req.query.offset || 0,
        limit = +req.query.limit || 50;

    CreditApplication
        .findAll({ offset: offset, limit: limit })
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

router.get('/:creditAppId', getCreditAppId, function(req, res, next) {
    CreditApplication
        .findById(req.creditAppId)
        .then(function(creditApp) {
            if (!creditApp) {
                return res.json({
                    message: 'No credit application has been found with given id'    
                });
            }
            
            res.json(creditApp);
        })
        .catch(function(error) {
            next(error);
        });
});

router.post('/', function(req, res, next) {
    CreditApplication
        .create({
            plannedSum: req.body.plannedSum,
            plannedTerm: req.body.plannedTerm,
            credit_type_id: req.body.creditTypeId,
            client_id: req.body.clientId
        })
        .then(function(creditApp) {            
            res.json({
                creditAppId: creditApp.id
            }); 
        })
        .catch(Sequelize.ValidationError, function(error) {
            next(new HttpApiError(400, error.message));
        })
        .catch(function(error) {
            next(error);
        });
});

router.delete('/:creditAppId', getCreditAppId, function(req, res, next) {
    CreditApplication
        .destroy({
            where: { id: req.creditAppId }
        })
        .then(function() {
            res.json({
                creditAppId: req.creditAppId
            });
        })
        .catch(function(error) {
            next(error);
        });
});

module.exports = router;
