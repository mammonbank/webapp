'use strict';

var express = require('express'),
    router  = express.Router(),
    //authenticateToken = require('../middlewares/authenticateToken'),
    prepareUpdateObject = require('../middlewares/prepareUpdateObject'),
    getCreditCatId = require('../middlewares/getCreditCatId'),
    CreditCategory  = require('models').CreditCategory,
    Sequelize = require('models').Sequelize,
    HttpApiError = require('error').HttpApiError;

router.get('/', function(req, res, next) {
    var offset = +req.query.offset || 0,
        limit = +req.query.limit || 50;

    CreditCategory
        .findAll({ offset: offset, limit: limit })
        .then(function(creditCats) {
            res.json({
                count: creditCats.length,
                offset: offset,
                limit: limit,
                creditCats: creditCats
            });
        })
        .catch(function(error) {
            next(error);
        });
});

router.get('/:creditCatId', getCreditCatId, function(req, res, next) {
    CreditCategory
        .findById(req.creditCatId)
        .then(function(creditCat) {
            if (!creditCat) {
                return res.json({
                    message: 'No credit category has been found with given id'    
                });
            }
            
            res.json(creditCat);
        })
        .catch(function(error) {
            next(error);
        });
});

router.post('/', function(req, res, next) {
    CreditCategory
        .create({
            title: req.body.title
        })
        .then(function(creditCat) {            
            res.json({
                creditCatId: creditCat.id
            }); 
        })
        .catch(Sequelize.ValidationError, function(error) {
            next(new HttpApiError(400, error.message));
        })
        .catch(function(error) {
            next(error);
        });
});

router.patch('/:creditCatId', getCreditCatId, prepareUpdateObject, function(req, res, next) {
    CreditCategory
        .update(req.updateObj, {
            where: {
                id: req.creditCatId
            }
        })
        .then(function() {
            res.json({
                updated: req.creditCatId
            });
        })
        .catch(Sequelize.ValidationError, function(error) {
            next(new HttpApiError(400, error.message));
        })
        .catch(function(error) {
            next(error);
        });
});

router.delete('/:creditCatId', getCreditCatId, function(req, res, next) {
    CreditCategory
        .destroy({
            where: { id: req.creditCatId }
        })
        .then(function() {
            res.json({
                creditCatId: req.creditCatId
            });
        })
        .catch(function(error) {
            next(error);
        });
});

module.exports = router;
