'use strict';

var express = require('express'),
    router = express.Router(),
    authenticateOverseerToken = require('../middlewares/authenticateOverseerToken'),
    getDepositTypeId = require('../middlewares/getDepositTypeId'),
    prepareUpdateObject = require('../middlewares/prepareUpdateObject'),
    DepositType = require('models').DepositType,
    Deposit = require('models').Deposit,
    Sequelize = require('models').Sequelize,
    HttpApiError = require('error').HttpApiError;


router.get('/', function (req, res, next) {
    var offset = +req.query.offset || 0,
        limit = +req.query.limit || 50;
    DepositType
        .findAll({ offset: offset, limit: limit })
        .then(function (depositTypes) {
            res.json({
                count: depositTypes.length,
                offset: offset,
                limit: limit,
                depositTypes: depositTypes
            });
        })
        .catch(function (error) {
            next(error);
        });
});

router.get('/:depositTypeId/deposits', getDepositTypeId, function(req, res, next) {
    var offset = +req.query.offset || 0,
        limit = +req.query.limit || 50;

    Deposit
        .findAll({ 
            offset: offset, 
            limit: limit,
            where: { deposit_type_id: req.depositTypeId }
        })
        .then(function(deposits) {
            res.json({
                count: deposits.length,
                offset: offset,
                limit: limit,
                deposits: deposits
            });
        })
        .catch(function(error) {
            next(error);
        });
});

router.get('/:depositTypeId', function (req, res, next) {
    DepositType
        .findById(req.params.depositTypeId)
        .then(function (depositType) {
            if (!depositType) {
                return res.json({
                    message: 'No deposit type has been found with given id'
                });
            }

            res.json(depositType);
        })
        .catch(function (error) {
            next(error);
        });
});

router.post('/', authenticateOverseerToken, function (req, res, next) {
    DepositType
        .create({
            title: req.body.title,
            description: req.body.description,
            interest: req.body.interest,
            minSum: req.body.minSum
        })
        .then(function(depositType) {         
            res.json({
                depositTypeId: depositType.id
            }); 
        })
        .catch(Sequelize.ValidationError, function(error) {
            next(new HttpApiError(400, error.message));
        })
        .catch(function(error) {
            next(error);
        });
});

router.patch('/:depositTypeId', authenticateOverseerToken,
                                getDepositTypeId, 
                                prepareUpdateObject, function(req, res, next) {
    DepositType
        .update(req.updateObj, {
            where: {
                id: req.depositTypeId
            }
        })
        .then(function() {
            res.json({
                updated: req.depositTypeId
            });
        })
        .catch(Sequelize.ValidationError, function(error) {
            next(new HttpApiError(400, error.message));
        })
        .catch(function(error) {
            next(error);
        });
});

router.delete('/:depositTypeId', authenticateOverseerToken,
                                 getDepositTypeId, function(req, res, next) {
    DepositType
        .destroy({
            where: { id: req.depositTypeId }
        })
        .then(function() {
            res.json({
                depositTypeId: req.depositTypeId
            });
        })
        .catch(function(error) {
            next(error);
        });
});

module.exports = router;
