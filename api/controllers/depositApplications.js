'use strict';

var express = require('express'),
    router  = express.Router(),
    //authenticateToken = require('../middlewares/authenticateToken'),
    prepareUpdateObject = require('../middlewares/prepareUpdateObject'),
    getDepositAppId = require('../middlewares/getDepositAppId'),
    DepositApplication  = require('models').DepositApplication,
    Operator  = require('models').Operator,
    Sequelize = require('models').Sequelize,
    sequelize = require('models').sequelize,
    HttpApiError = require('error').HttpApiError;

router.get('/', function(req, res, next) {
    var offset = +req.query.offset || 0,
        limit = +req.query.limit || 50;

    DepositApplication
        .findAll({ offset: offset, limit: limit })
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

router.get('/:depositAppId', getDepositAppId, function(req, res, next) {
    DepositApplication
        .findById(req.depositAppId)
        .then(function(depositApp) {
            if (!depositApp) {
                return res.json({
                    message: 'No deposit application has been found with given id'    
                });
            }
            
            res.json(depositApp);
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
            return DepositApplication.create({
                plannedSum: req.body.plannedSum,
                deposit_type_id: req.body.depositTypeId,
                client_id: req.body.clientId,
                operator_id: operatorId
            }, { transaction: t });
        });
    })
    .then(function(depositApp) {            
        res.json({
            depositAppId: depositApp.id
        }); 
    })
    .catch(Sequelize.ValidationError, function(error) {
        next(new HttpApiError(400, error.message));
    })
    .catch(function(error) {
        next(error);
    });   
});

router.patch('/:depositAppId', getDepositAppId, prepareUpdateObject, function(req, res, next) {
    DepositApplication
        .update(req.updateObj, {
            where: {
                id: req.depositAppId
            }
        })
        .then(function() {
            res.json({
                updated: req.depositAppId
            });
        })
        .catch(Sequelize.ValidationError, function(error) {
            next(new HttpApiError(400, error.message));
        })
        .catch(function(error) {
            next(error);
        });
});

router.delete('/:depositAppId', getDepositAppId, function(req, res, next) {
    DepositApplication
        .destroy({
            where: { id: req.depositAppId }
        })
        .then(function() {
            res.json({
                depositAppId: req.depositAppId
            });
        })
        .catch(function(error) {
            next(error);
        });
});

module.exports = router;
