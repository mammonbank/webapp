'use strict';

var express = require('express'),
    router  = express.Router(),
    //authenticateToken = require('../middlewares/authenticateToken'),
    prepareUpdateObject = require('../middlewares/prepareUpdateObject'),
    getCreditId = require('../middlewares/getCreditId'),
    Credit  = require('models').Credit,
    ClientAccount = require('models').ClientAccount,
    BankInfo = require('models').BankInfo,
    Sequelize = require('models').Sequelize,
    sequelize = require('models').sequelize,
    HttpApiError = require('error').HttpApiError,
    Decimal = require('decimal');

router.get('/', function(req, res, next) {
    var offset = +req.query.offset || 0,
        limit = +req.query.limit || 50;

    Credit
        .findAll({ offset: offset, limit: limit })
        .then(function(credits) {
            res.json({
                count: credits.length,
                offset: offset,
                limit: limit,
                credits: credits
            });
        })
        .catch(function(error) {
            next(error);
        });
});

router.get('/:creditId', getCreditId, function(req, res, next) {
    Credit
        .findById(req.creditId)
        .then(function(credit) {
            if (!credit) {
                return res.json({
                    message: 'No credit has been found with given id'    
                });
            }
            
            res.json(credit);
        })
        .catch(function(error) {
            next(error);
        });
});

router.post('/', function(req, res, next) {
    var creditId;

    sequelize.transaction(function(t) {
       var creditSum;
       //first - create credit
       return Credit.create({
           sum: req.body.sum,
           //at first outstandingLoan equals to credit sum
           outstandingLoan: req.body.sum,
           startDate: req.body.startDate,
           endDate: req.body.endDate,
           credit_type_id: req.body.creditTypeId,
           client_id: req.body.clientId
        }, { transaction: t })
        //second - find corresponding client account
        .then(function(credit) {
            creditSum = credit.sum;
            creditId = credit.id;
            
            return ClientAccount.findOne({
                where: {
                    client_id: credit.client_id
                },
                transaction: t
            });
        })
        //third - add credit sum to account's amount of money
        .then(function(clientAccount) {
            return ClientAccount.update({
                amount: new Decimal(clientAccount.amount).add(creditSum).toNumber()
            }, {
                where: { id: clientAccount.id },
                transaction: t
            });
        })
        //forth - find bank info
        .then(function(clientAccount) {
            return BankInfo.findById(1, { transaction: t });
        })
        //fifth - decrease bank's moneySupply
        .then(function(bankInfo) {
            return BankInfo.update({
                moneySupply: new Decimal(bankInfo.moneySupply).sub(creditSum).toNumber()
            }, {
                where: { id: 1 },
                transaction: t
            });
        });
    })
    //at this point transaction either has been committed or rolled back
    .then(function() {            
        res.json({
            creditId: creditId
        }); 
    })
    .catch(Sequelize.ValidationError, function(error) {
        next(new HttpApiError(400, error.message));
    })
    .catch(function(error) {
        next(error);
    });
});

router.patch('/:creditId', getCreditId, prepareUpdateObject, function(req, res, next) {
    Credit
        .update(req.updateObj, {
            where: {
                id: req.creditId
            }
        })
        .then(function() {
            res.json({
                updated: req.creditId
            });
        })
        .catch(function(error) {
            next(error);
        });
});

router.delete('/:creditId', getCreditId, function(req, res, next) {
    Credit
        .destroy({
            where: { id: req.creditId }
        })
        .then(function() {
            res.json({
                creditId: req.creditId
            });
        })
        .catch(function(error) {
            next(error);
        });
});

module.exports = router;
