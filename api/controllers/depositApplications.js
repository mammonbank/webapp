'use strict';

var express = require('express'),
    router  = express.Router(),
    //authenticateToken = require('../middlewares/authenticateToken'),
    prepareUpdateObject = require('../middlewares/prepareUpdateObject'),
    getDepositAppId = require('../middlewares/getDepositAppId'),
    DepositApplication  = require('models').DepositApplication,
    //Operator  = require('models').Operator,
    Sequelize = require('models').Sequelize,
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

//выбрать всех операторов
//найти у кого из них меньше всего заявок (учитывать заявки на кредиты и депозиты)
//назначить ему заявку

router.post('/', function(req, res, next) {
    DepositApplication
        .create({
            plannedSum: req.body.plannedSum,
            deposit_type_id: req.body.depositTypeId,
            client_id: req.body.clientId
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
