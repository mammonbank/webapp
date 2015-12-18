'use strict';

var express = require('express'),
    router  = express.Router(),
    authenticateOperatorToken = require('../middlewares/authenticateOperatorToken'),
    authenticateClientToken = require('../middlewares/authenticateClientToken'),
    prepareUpdateObject = require('../middlewares/prepareUpdateObject'),
    getCreditId = require('../middlewares/getCreditId'),
    Credit  = require('models').Credit,
    ClientAccount = require('models').ClientAccount,
    BankInfo = require('models').BankInfo,
    Sequelize = require('models').Sequelize,
    sequelize = require('models').sequelize,
    HttpApiError = require('error').HttpApiError,
    Decimal = require('decimal.js'),
    helper = require('helper'),
    banklogic = require('banklogic');

Decimal.config({
    precision: 20,
    rounding: 8,
    errors: false
});

router.get('/', authenticateOperatorToken, function(req, res, next) {
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

router.get('/:creditId', authenticateOperatorToken,
                         getCreditId, function(req, res, next) {
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

router.get('/:creditId/info', authenticateClientToken, 
                              getCreditId, function(req, res, next) {
    Credit
        .findById(req.creditId)
        .then(function(credit) {
            if (!credit) {
                return res.json({
                    message: 'No credit has been found with given id'    
                });
            }
            
            credit.getCreditRepaymentInfo(function(error, creditRepaymentInfo) {
                if (error) {
                    return next(error);
                }
                
                return res.json(creditRepaymentInfo);
            });
        })
        .catch(function(error) {
            next(error);
        });
});

//example:
//:3000/api/credits/info/payment?type=equal&sum=20000000&startDate=12-31-2014&endDate=12-31-2018&interest=0.48&title=Easy
router.get('/info/payment', function(req, res, next) {
    var info = {
            sum: +req.query.sum,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
            interest: +req.query.interest,
            title: req.query.title
        },
        creditRepaymentInfo;

    for (var property in info) {
        if (info.hasOwnProperty(property)) {
            if (!info[property]) {
                return res.status(400).json({
                    message: 'Missing parameters'
                });
            }
        }
    }
    
    try {
        info.staticFee = new Decimal(info.sum)
            .div(helper.getMonthsDiff(info.endDate, info.startDate)).toNumber();
    
        if (req.query.type === 'equal') {
            creditRepaymentInfo = banklogic.getCreditAnnuityRepaymentInfo(info);
        } else if (req.query.type === 'diff') {
            creditRepaymentInfo = banklogic.getCreditDifferentiatedRepaymentInfo(info);
        } else {
            return next(new HttpApiError(400, 'Type does not specified'));
        }
    }
    catch(ex) {
        return next(ex);
    }
    
    return res.json(creditRepaymentInfo);
});

router.post('/', authenticateOperatorToken, function(req, res, next) {
    var creditId;

    sequelize.transaction(function(t) {
       var creditSum;
       //first - create credit
       return Credit.create({
           sum: req.body.sum,
           //at first outstandingLoan equals to credit sum
           outstandingLoan: req.body.sum,
           repaymentType: req.body.repaymentType,
           startDate: req.body.startDate,
           endDate: req.body.endDate,
           numberOfPayments: 0,
           overdueSum: 0,
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
                amount: new Decimal(clientAccount.amount).plus(creditSum).toNumber()
            }, {
                where: { id: clientAccount.id },
                transaction: t
            });
        })
        //forth - find bank info
        .then(function() {
            return BankInfo.findById(1, { transaction: t });
        })
        //fifth - decrease bank's moneySupply
        .then(function(bankInfo) {
            return BankInfo.update({
                moneySupply: new Decimal(bankInfo.moneySupply).minus(creditSum).toNumber()
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

router.patch('/:creditId', authenticateOperatorToken, 
                           getCreditId, 
                           prepareUpdateObject, function(req, res, next) {
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
        .catch(Sequelize.ValidationError, function(error) {
            next(new HttpApiError(400, error.message));
        })
        .catch(function(error) {
            next(error);
        });
});

router.delete('/:creditId', authenticateOperatorToken, 
                            getCreditId, function(req, res, next) {
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
