'use strict';

var express = require('express'),
    router  = express.Router(),
    //authenticateToken = require('../middlewares/authenticateToken'),
    prepareUpdateObject = require('../middlewares/prepareUpdateObject'),
    getCreditAppId = require('../middlewares/getCreditAppId'),
    CreditApplication  = require('models').CreditApplication,
    Operator  = require('models').Operator,
    Sequelize = require('models').Sequelize,
    sequelize = require('models').sequelize,
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

//find all operators
//find who has the fewest number of applications (creidit and deposit)
//assign application to him
router.post('/', function(req, res, next) {
    var operatorId;
    
    sequelize.transaction(function(t) {
        return Operator.findAll({ transaction: t })
        .then(function(operators) {
            if (!operators) {
                throw new Error('No operators found');
            }
            
            //maybe some more complex logic here...
            
            var operatorIndex = 0;
            
            for (var i = 1; i < operators.length; i++) {
                if ( operators[i].numberOfApplications < operators[operatorIndex].numberOfApplications ) {
                    operatorIndex = i;
                }
            }
            
            operatorId = operators[operatorIndex].id;
            
            return Operator.findById(operatorId, { transaction: t });
        })
        .then(function(operator) {
            return Operator.update( {
                numberOfApplications: operator.numberOfApplications + 1
            }, {
                where: { id: operator.id },
                transaction: t
            });
        })
        .then(function() {
            return CreditApplication.create({
                plannedSum: req.body.plannedSum,
                plannedTerm: req.body.plannedTerm,
                credit_type_id: req.body.creditTypeId,
                client_id: req.body.clientId,
                operator_id: operatorId
            }, { transaction: t });
        });
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

router.patch('/:creditAppId', getCreditAppId, prepareUpdateObject, function(req, res, next) {
    CreditApplication
        .update(req.updateObj, {
            where: {
                id: req.creditAppId
            }
        })
        .then(function() {
            res.json({
                updated: req.creditAppId
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
