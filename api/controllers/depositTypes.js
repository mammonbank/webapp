'use strict';

var express = require('express'),
    router = express.Router(),
    DepositType = require('models').DepositType,
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

router.get('/:depositTypeId', function (req, res, next) {
    DepositType
        .findById(req.params.depositTypeId)
        .then(function (DepositType) {
            if (!DepositType) {
                return res.json({
                    message: 'No deposit type has been found with given id'
                });
            }

            res.json(DepositType);
        })
        .catch(function (error) {
            next(error);
        });
});

router.post('/', function (req, res, next) {
    DepositType
        .create({
            percent: req.body.percent,
            title: req.body.title,
            description: req.body.description,
            minSum: req.body.minSum,
            minTerm: req.body.minTerm,
        })
        .then(function (DepositType) {
            res.json({
                DepositTypeId: DepositType.id
            });
        })
        .catch(Sequelize.ValidationError, function (error) {
            next(new HttpApiError(400, error.message));
        })
        .catch(function (error) {
            next(error);
        });
});

module.exports = router;
