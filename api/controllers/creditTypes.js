'use strict';

var express = require('express'),
    router  = express.Router(),
    authenticateOverseerToken = require('../middlewares/authenticateOverseerToken'),
    prepareUpdateObject = require('../middlewares/prepareUpdateObject'),
    getCreditTypeId = require('../middlewares/getCreditTypeId'),
    CreditType  = require('models').CreditType,
    Credit = require('models').Credit,
    Sequelize = require('models').Sequelize,
    HttpApiError = require('error').HttpApiError;

router.get('/', function(req, res, next) {
    var offset = +req.query.offset || 0,
        limit = +req.query.limit || 50;

    CreditType
        .findAll({ offset: offset, limit: limit })
        .then(function(creditTypes) {
            res.json({
                count: creditTypes.length,
                offset: offset,
                limit: limit,
                creditTypes: creditTypes
            });
        })
        .catch(function(error) {
            next(error);
        });
});

router.get('/:creditTypeId/credits', getCreditTypeId, function(req, res, next) {
    var offset = +req.query.offset || 0,
        limit = +req.query.limit || 50;

    Credit
        .findAll({ 
            offset: offset, 
            limit: limit,
            where: { credit_type_id: req.creditTypeId }
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

router.get('/:creditTypeId', getCreditTypeId, function(req, res, next) {
    CreditType
        .findById(req.creditTypeId)
        .then(function(creditType) {
            if (!creditType) {
                return res.json({
                    message: 'No credit type has been found with given id'    
                });
            }
            
            res.json(creditType);
        })
        .catch(function(error) {
            next(error);
        });
});

router.post('/', authenticateOverseerToken, function(req, res, next) {
    CreditType
        .create({
            title: req.body.title,
            description: req.body.description,
            minSum: req.body.minSum,
            maxSum: req.body.maxSum,
            minTerm: req.body.minTerm,
            maxTerm: req.body.maxTerm,
            interest: req.body.interest,
            credit_category_id: req.body.creditCategoryId
        })
        .then(function(creditType) {         
            res.json({
                creditTypeId: creditType.id
            }); 
        })
        .catch(Sequelize.ValidationError, function(error) {
            next(new HttpApiError(400, error.message));
        })
        .catch(function(error) {
            next(error);
        });
});

router.patch('/:creditTypeId', authenticateOverseerToken,
                               getCreditTypeId, 
                               prepareUpdateObject, function(req, res, next) {
    CreditType
        .update(req.updateObj, {
            where: {
                id: req.creditTypeId
            }
        })
        .then(function() {
            res.json({
                updated: req.creditTypeId
            });
        })
        .catch(Sequelize.ValidationError, function(error) {
            next(new HttpApiError(400, error.message));
        })
        .catch(function(error) {
            next(error);
        });
});

router.delete('/:creditTypeId', authenticateOverseerToken, 
                                getCreditTypeId, function(req, res, next) {
    CreditType
        .destroy({
            where: { id: req.creditTypeId }
        })
        .then(function() {
            res.json({
                creditTypeId: req.creditTypeId
            });
        })
        .catch(function(error) {
            next(error);
        });
});

module.exports = router;
