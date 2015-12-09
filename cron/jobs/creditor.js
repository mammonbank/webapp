'use strict';

var CronJob = require('cron').CronJob,
    Credit = require('models').Credit,
    helper = require('helper'),
    BankError = require('error').BankError,
    Decimal = require('decimal.js'),
    debug = require('debug')('mammonbank:cron');

Decimal.config({
    precision: 20,
    rounding: 8,
    errors: false
});

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
                                
                                debug('Insufficient funds -- penalty for overdue loan: ' +
                                  overduePayment + '. CreditId: ' + credit.id);
                                loop.next();
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
                            credit.save().then(function() {
                                return credit.destroy();
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
