'use strict';

var express = require('express'),
    router  = express.Router(),
    authenticateOperatorToken = require('../middlewares/authenticateOperatorToken'),
    authenticateClientToken = require('../middlewares/authenticateClientToken'),
    prepareUpdateObject = require('../middlewares/prepareUpdateObject'),
    getCreditAppId = require('../middlewares/getCreditAppId'),
    CreditApplication  = require('models').CreditApplication,
    BankEmployee  = require('models').BankEmployee,
    Sequelize = require('models').Sequelize,
    sequelize = require('models').sequelize,
    HttpApiError = require('error').HttpApiError;

router.get('/', authenticateOperatorToken, function(req, res, next) {
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

router.get('/archives', authenticateOperatorToken, function(req, res, next) {
    var offset = +req.query.offset || 0,
        limit = +req.query.limit || 50;

    CreditApplication
        .findAll({
            offset: offset,
            limit: limit,
            paranoid: false,
            where: {
                deleted_at: {
                    $ne: null
                }
            } 
         })
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

router.get('/:creditAppId', authenticateOperatorToken,
                            getCreditAppId, function(req, res, next) {
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
router.post('/', authenticateClientToken, function(req, res, next) {
    var operatorId;
    
    sequelize.transaction(function(t) {
        return BankEmployee.findAll({ where: { type: 'OPERATOR' }, transaction: t })
        .then(function(operators) {
            if (!operators || operators.length === 0) {
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
            
            return BankEmployee.findById(operatorId, { transaction: t });
        })
        .then(function(operator) {
            return BankEmployee.update( {
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
                bank_employee_id: operatorId
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

router.patch('/:creditAppId', authenticateOperatorToken,
                              getCreditAppId, 
                              prepareUpdateObject, function(req, res, next) {
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

router.delete('/:creditAppId', authenticateOperatorToken, 
                               getCreditAppId, function(req, res, next) {
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
