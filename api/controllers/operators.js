'use strict';

var express = require('express'),
    router  = express.Router(),
    //authenticateToken = require('../middlewares/authenticateToken'),
    prepareUpdateObject = require('../middlewares/prepareUpdateObject'),
    getOperatorId = require('../middlewares/getOperatorId'),
    Operator  = require('models').Operator,
    Sequelize = require('models').Sequelize,
    HttpApiError = require('error').HttpApiError;

router.get('/', function(req, res, next) {
    var offset = +req.query.offset || 0,
        limit = +req.query.limit || 50;

    Operator
        .findAll({ offset: offset, limit: limit })
        .then(function(operators) {
            res.json({
                count: operators.length,
                offset: offset,
                limit: limit,
                operators: operators
            });
        })
        .catch(function(error) {
            next(error);
        });
});

router.get('/:operatorId', getOperatorId, function(req, res, next) {
    Operator
        .findById(req.operatorId)
        .then(function(operator) {
            if (!operator) {
                return res.json({
                    message: 'No operator has been found with given id'    
                });
            }
            
            res.json(operator);
        })
        .catch(function(error) {
            next(error);
        });
});

router.post('/', function(req, res, next) {
    Operator
        .create({
            username: req.body.username,
            password: req.body.password,
            numberOfApplications: 0
        })
        .then(function(operator) {            
            res.json({
                operatorId: operator.id
            }); 
        })
        .catch(Sequelize.ValidationError, function(error) {
            next(new HttpApiError(400, error.message));
        })
        .catch(function(error) {
            next(error);
        });
});

router.patch('/:operatorId', getOperatorId, prepareUpdateObject, function(req, res, next) {
    Operator
        .update(req.updateObj, {
            where: {
                id: req.operatorId
            },
            individualHooks: true
        })
        .then(function() {
            res.json({
                updated: req.operatorId
            });
        })
        .catch(Sequelize.ValidationError, function(error) {
            next(new HttpApiError(400, error.message));
        })
        .catch(function(error) {
            next(error);
        });
});

router.delete('/:operatorId', getOperatorId, function(req, res, next) {
    Operator
        .destroy({
            where: { id: req.operatorId }
        })
        .then(function() {
            res.json({
                operatorId: req.operatorId
            });
        })
        .catch(function(error) {
            next(error);
        });
});

module.exports = router;
