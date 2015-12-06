'use strict';

var CronJob = require('cron').CronJob,
    Credit = require('models').Credit,
    helper = require('helper'),
    BankError = require('error').BankError;
    //debug = require('debug')('mammonbank:cron');

function onTick() {
    Credit
        .findAll()
        .then(function(credits) {
            var now = Date.now();
            credits.forEach(function(credit) {
                var lastPaymentDate = credit.lastPaymentDate || credit.created_at,
                    monthsDiff = helper.getMonthsDiff(now, lastPaymentDate);
                
                if (now <= credit.endDate || monthsDiff < 1) {
                    return;
                }
                
                credit.payCredit(function(error) {
                    credit.lastPaymentDate = new Date();
                    credit.save();
                    
                    if (error) {
                        //insufficient funds
                        if (error instanceof BankError) {
                            //начислить пеню
                            throw error;
                        }
                        else {
                            throw error;
                        }
                    }
                    
                    console.log('Credit transaction successfully passed', 'CreditId: ', credit.id);
                    
                    //credit has been repaid
                    if (credit.outstandingLoan === 0) {
                        console.log('Credit successfully repaid', 'CreditId: ', credit.id);
                        credit.destroy();
                    }
                    
                });
                    
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
