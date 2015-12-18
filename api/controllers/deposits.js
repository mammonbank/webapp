'use strict';

var express = require('express'),
    router  = express.Router(),
    authenticateOperatorToken = require('../middlewares/authenticateOperatorToken'),
    authenticateClientToken = require('../middlewares/authenticateClientToken'),
    prepareUpdateObject = require('../middlewares/prepareUpdateObject'),
    getClientId = require('../middlewares/getClientId'),
    getDepositId = require('../middlewares/getDepositId'),
    Deposit  = require('models').Deposit,
    ClientAccount = require('models').ClientAccount,
    BankInfo = require('models').BankInfo,
    Sequelize = require('models').Sequelize,
    sequelize = require('models').sequelize,
    HttpApiError = require('error').HttpApiError,
    Decimal = require('decimal.js');

Decimal.config({
    precision: 20,
    rounding: 8,
    errors: false
});

router.get('/', authenticateOperatorToken, function(req, res, next) {
    var offset = +req.query.offset || 0,
        limit = +req.query.limit || 50;

    Deposit
        .findAll({ offset: offset, limit: limit })
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

router.get('/:depositId', authenticateOperatorToken, 
                          getDepositId, function(req, res, next) {
    Deposit
        .findById(req.depositId)
        .then(function(deposit) {
            if (!deposit) {
                return res.json({
                    message: 'No deposit has been found with given id'    
                });
            }
            
            res.json(deposit);
        })
        .catch(function(error) {
            next(error);
        });
});
        
router.post('/', authenticateClientToken, function(req, res, next) {
    var depositId;

    sequelize.transaction(function(t) {
       var depositSum;
       //first - create deposit
       return Deposit.create({
           sum: req.body.sum,
           startDate: new Date(),
           deposit_type_id: req.body.depositTypeId,
           client_id: req.body.clientId
        }, { transaction: t })
        //second - find corresponding client account
        .then(function(deposit) {
            depositSum = deposit.sum;
            depositId = deposit.id;
            
            return ClientAccount.findOne({
                where: {
                    client_id: deposit.client_id
                },
                transaction: t
            });
        })
        //third - add deposit start sum to account's amount of money
        .then(function(clientAccount) {
            return ClientAccount.update({
                amount: new Decimal(clientAccount.amount).plus(depositSum).toNumber()
            }, {
                where: { id: clientAccount.id },
                transaction: t
            });
        })
        //forth - find bank info
        .then(function() {
            return BankInfo.findById(1, { transaction: t });
        })
        //fifth - increase bank's baseMoney and moneySupply:
        .then(function(bankInfo) {
            return BankInfo.update({
                //baseMoney += deposit * reserveRatio
                baseMoney: new Decimal(bankInfo.baseMoney).plus( 
                        new Decimal(depositSum).times(bankInfo.reserveRatio)
                    ).toNumber(),
                //moneySupply += deposit * (1 - reserveRatio)
                moneySupply: new Decimal(bankInfo.moneySupply).plus(
                        new Decimal(depositSum).times(1 - bankInfo.reserveRatio)
                    ).toNumber()
            }, {
                where: { id: 1 },
                transaction: t
            });
        });
    })
    //at this point transaction either has been committed or rolled back
    .then(function() {            
        res.json({
            depositId: depositId
        }); 
    })
    .catch(Sequelize.ValidationError, function(error) {
        next(new HttpApiError(400, error.message));
    })
    .catch(function(error) {
        next(error);
    });
});

router.post('/:clientId/deposit/:depositId', authenticateClientToken, 
                                             getClientId, 
                                             getDepositId, function(req, res, next) {
    var sum = +req.body.sum;
    if (!sum || sum <= 0) {
        return next(new HttpApiError(400, 'Invalid sum'));
    }
    
    var newDepositSum;
    
    sequelize.transaction(function(t) {
        return ClientAccount.findOne({
            where: {
                client_id: req.clientId
            },
            transaction: t
        })
        .then(function(clientAccount) {
            return ClientAccount.update({
                amount: new Decimal(clientAccount.amount).minus(sum).toNumber()
            }, {
                where: { client_id: req.clientId },
                transaction: t
            });
        })
        .then(function() {
            return Deposit.findById(req.depositId, { transaction: t });
        })
        .then(function(deposit) {
            newDepositSum = new Decimal(deposit.sum).plus(sum).toNumber();
            
            return Deposit.update({
                sum: newDepositSum
            }, {
                where: { id: deposit.id },
                transaction: t
            });
        })
        .then(function() {
            return BankInfo.findById(1, { transaction: t });
        })
        .then(function(bankInfo) {
            return BankInfo.update({
                //baseMoney += deposit * reserveRatio
                baseMoney: new Decimal(bankInfo.baseMoney).plus( 
                        new Decimal(sum).times(bankInfo.reserveRatio)
                    ).toNumber(),
                //moneySupply += deposit * (1 - reserveRatio)
                moneySupply: new Decimal(bankInfo.moneySupply).plus(
                        new Decimal(sum).times(1 - bankInfo.reserveRatio)
                    ).toNumber()
            }, {
                where: { id: 1 },
                transaction: t
            });
        });
    })
    //at this point transaction either has been committed or rolled back
    .then(function() {            
        res.json({
            depositSum: newDepositSum
        }); 
    })
    .catch(Sequelize.ValidationError, function(error) {
        next(new HttpApiError(400, error.message));
    })
    .catch(function(error) {
        next(error);
    });
});

router.post('/:clientId/withdraw/:depositId', authenticateClientToken,
                                              getClientId, 
                                              getDepositId, function(req, res, next) {
    var sum = +req.body.sum;
    if (!sum || sum <= 0) {
        return next(new HttpApiError(400, 'Invalid sum'));
    }
    
    var newDepositSum;
    
    sequelize.transaction(function(t) {
        return ClientAccount.findOne({
            where: {
                client_id: req.clientId
            },
            transaction: t
        })
        .then(function(clientAccount) {
            return ClientAccount.update({
                amount: new Decimal(clientAccount.amount).plus(sum).toNumber()
            }, {
                where: { client_id: req.clientId },
                transaction: t
            });
        })
        .then(function() {
            return Deposit.findById(req.depositId, { transaction: t });
        })
        .then(function(deposit) {
            newDepositSum = new Decimal(deposit.sum).minus(sum).toNumber();
            
            return Deposit.update({
                sum: newDepositSum
            }, {
                where: { id: deposit.id },
                transaction: t
            });
        })
        .then(function() {
            return BankInfo.findById(1, { transaction: t });
        })
        .then(function(bankInfo) {
            return BankInfo.update({
                //baseMoney -= deposit * reserveRatio
                baseMoney: new Decimal(bankInfo.baseMoney).minus( 
                        new Decimal(sum).times(bankInfo.reserveRatio)
                    ).toNumber(),
                //moneySupply -= deposit * (1 - reserveRatio)
                moneySupply: new Decimal(bankInfo.moneySupply).minus(
                        new Decimal(sum).times(1 - bankInfo.reserveRatio)
                    ).toNumber()
            }, {
                where: { id: 1 },
                transaction: t
            });
        });
    })
    //at this point transaction either has been committed or rolled back
    .then(function() {            
        res.json({
            depositSum: newDepositSum
        }); 
    })
    .catch(Sequelize.ValidationError, function(error) {
        next(new HttpApiError(400, error.message));
    })
    .catch(function(error) {
        next(error);
    });
});

//more in debug purpuses
//in prod direct invocation of this method (and other updates - credits, accounts, etc.) is unacceptable
router.patch('/:depositId', authenticateOperatorToken, 
                            getDepositId, 
                            prepareUpdateObject, function(req, res, next) {
    Deposit
        .update(req.updateObj, {
            where: {
                id: req.depositId
            }
        })
        .then(function() {
            res.json({
                updated: req.depositId
            });
        })
        .catch(Sequelize.ValidationError, function(error) {
            next(new HttpApiError(400, error.message));
        })
        .catch(function(error) {
            next(error);
        });
});
//debug purpuses
router.delete('/:depositId', authenticateOperatorToken, 
                             getDepositId, function(req, res, next) {
    Deposit
        .destroy({
            where: { id: req.depositId }
        })
        .then(function() {
            res.json({
                depositId: req.depositId
            });
        })
        .catch(function(error) {
            next(error);
        });
});

module.exports = router;
