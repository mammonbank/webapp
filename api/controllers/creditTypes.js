'use strict';

var express = require('express'),
    router  = express.Router(),
    //authenticateToken = require('../middlewares/authenticateToken'),
    prepareUpdateObject = require('../middlewares/prepareUpdateObject'),
    getCreditTypeId = require('../middlewares/getCreditTypeId'),
    CreditType  = require('models').CreditType,
    Sequelize = require('sequelize'),
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

router.post('/', function(req, res, next) {
    CreditType
        .create({
            title: req.body.title,
            minSum: req.body.minSum,
            maxSum: req.body.maxSum,
            term: req.body.term,
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

router.patch('/:creditTypeId', getCreditTypeId, prepareUpdateObject, function(req, res, next) {
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
        .catch(function(error) {
            next(error);
        });
});

router.delete('/:creditTypeId', getCreditTypeId, function(req, res, next) {
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
