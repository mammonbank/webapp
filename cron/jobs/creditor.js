'use strict';

var CronJob = require('cron').CronJob,
    Credit = require('models').Credit,
    Client = require('models').Client,
    sequelize = require('models').sequelize,
    helper = require('helper'),
    BankError = require('error').BankError,
    Decimal = require('decimal.js'),
    debug = require('debug')('mammonbank:cron');

Decimal.config({
    precision: 20,
    rounding: 8,
    errors: false
});

//crazy mess...
function onTick() {
    Credit
        .findAll()
        .then(function(credits) {
            var //now = new Date(),
                i = 0;
                
            if (credits === null) {
                return;
            }
            
            helper.syncLoop(credits.length, function(loop) {
                var credit = credits[i],
                    clientId =  credit.client_id,
                    lastPaymentDate = credit.lastPaymentDate || credit.startDate;
                    //monthsDiff = helper.getMonthsDiff(now, lastPaymentDate);
                
                // if (now <= credit.endDate || monthsDiff < 1) {
                //     return loop.next();
                // }

                i++;
                
                credit.payCredit(credit.numberOfPayments, function(error, isRepaid) {
                    if (error) {
                        //insufficient funds
                        if (error instanceof BankError) {
                            
                            credit.setOverduePayment(function(error, overduePayment) {
                                if (error) {
                                    throw error;
                                }
                                
                                Client
                                    .findById(clientId)
                                    .then(function(client) {
                                        Client.update({
                                            creditHistoryCoefficient: client.creditHistoryCoefficient - 0.1
                                        }, {
                                            where: { id: client.id }
                                        });
                                    })
                                    .then(function() {
                                        debug('Insufficient funds -- penalty for overdue loan: ' +
                                            overduePayment + '. CreditId: ' + credit.id);
                                  
                                        loop.next();
                                    })
                                    .catch(function(error) {
                                        throw error;
                                    });
                                
                            });

                        }
                        else {
                            throw error;
                        }
                    } else {
                        //if we got here then client has paid all his overdue fees
                        credit.overdueSum = 0;
                        lastPaymentDate = helper.addMonthsToDate(lastPaymentDate, 1);
                        if (lastPaymentDate >= credit.endDate) {
                            lastPaymentDate = credit.endDate;
                        }
                        
                        credit.lastPaymentDate = lastPaymentDate;
                        
                        if (isRepaid) {
                            debug(isRepaid);
                            debug(credit.outstandingLoan);
                            
                            sequelize.transaction(function(t) {
                                return Credit.update({
                                    lastPaymentDate: lastPaymentDate
                                }, {
                                    where: { id: credit.id },
                                    transaction: t 
                                })
                                .then(function() {
                                    return Credit.destroy({
                                        where: { id: credit.id },
                                        transaction: t
                                    });
                                })
                                .then(function() {
                                    return Client.findById(clientId, { transaction: t });
                                })
                                .then(function(client) {
                                    return Client.update({
                                        creditHistoryCoefficient: client.creditHistoryCoefficient + 10
                                    }, {
                                        where: { id: client.id },
                                        transaction: t
                                    });
                                });
                            })
                            .then(function() {
                                debug('Credit successfully repaid', 'CreditId: ', credit.id);
                                loop.next();
                            })
                            .catch(function(error) {
                                throw error;
                            });
                            
                        } else {
                            
                            credit.save().then(function() {
                                debug('Credit transaction successfully passed', 'CreditId: ', credit.id);
                                loop.next();
                            })
                            .catch(function(error) {
                                throw error;
                            });
                            
                        }
                    }
            
                });

            }, function() {
                debug('----done----');
            });
            
            
            

        })
        .catch(function(error) {
            throw error;
        });
}

module.exports = function(cronTime) {
    var job = new CronJob({
        cronTime: cronTime,
        onTick: onTick,
        start: false
    });
    
    return job;
};
