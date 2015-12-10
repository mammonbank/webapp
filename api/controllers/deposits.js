'use strict';

var express = require('express'),
    router = express.Router(),
    Deposit = require('models').Deposit,
    Sequelize = require('models').Sequelize,
    sequelize = require('models').sequelize,
    HttpApiError = require('error').HttpApiError,
    BankError = require('error').BankError,
    DepositType = require('models').DepositType;


router.get('/', function (req, res, next) {
    var offset = +req.query.offset || 0,
        limit = +req.query.limit || 50;

    Deposit
        .findAll({ offset: offset, limit: limit })
        .then(function (deposits) {
            res.json({
                count: deposits.length,
                offset: offset,
                limit: limit,
                deposits: deposits
            });
        })
        .catch(function (error) {
            next(error);
        });
});



router.get('/clientCredits/:clientId', function (req, res, next) {
    Deposit
        .findAll({
            where:
                { client_id: req.params.clientId }
        })
        .then(function (deposits) {
            if (!deposits || deposits.length == 0) {
                return res.json({
                    message: 'client does not exists or does not have deposit'
                });
            }

            res.json(deposits);
        })
        .catch(function (error) {
            next(error);
        });
});

router.get('/:depositId', function (req, res, next) {
    Deposit
        .findById(req.params.depositId)
        .then(function (deposit) {
            if (!deposit) {
                return res.json({
                    message: 'No deposit has been found with given id'
                });
            }

            res.json(deposit);
        })
        .catch(function (error) {
            next(error);
        });
});

router.post('/', function(req, res, next) {
    var depositId;

    sequelize.transaction(function (t) {
        return Deposit.create({
                percent: req.body.percent,
                startDate: req.body.startDate,
                term: req.body.term,
                deposit_type_id: req.body.depositTypeId,
                client_id: req.body.clientId,
                startSum: req.body.sum,
                currentSum: req.body.sum,
            }, { transaction: t })
            .then(function (deposit) {
                depositId = deposit.id;
                return DepositType
                    .findById(deposit.deposit_type_id)
                    .then(function(depositType) {
                        var isValid = true;
                        isValid = deposit.term == null || deposit.term >= depositType.minTerm;
                        isValid = (depositType.minSum == null || deposit.startSum >= depositType.minSum) && isValid;
                        console.log(isValid);
                        if (!isValid) {
                            throw new BankError("deposit is not valid");
                        }
                    }, { transaction: t });
            }, { transaction: t })
            // TODO: logic for client account
            .then(function () {
                    res.json({
                        depositId: depositId
                    });
            })
            .catch(Sequelize.ValidationError, function(error) {
                next(new HttpApiError(400, error.message));
            })
            .catch(function(error) {
                next(error);
            }, {transcation: t});
    });
});

module.exports = router;
