'use strict';

var CronJob = require('cron').CronJob,
    Deposit = require('models').Deposit,
    helper = require('helper'),
    Decimal = require('decimal.js'),
    debug = require('debug')('mammonbank:cron');

Decimal.config({
    precision: 20,
    rounding: 8,
    errors: false
});

function onTick() {
    Deposit
        .findAll()
        .then(function(deposits) {
            var //now = new Date(),
                i = 0;
                
            if (deposits === null) {
                return;
            }
            
            helper.syncLoop(deposits.length, function(loop) {
                var deposit = deposits[i],
                    lastInterestDate = deposit.lastInterestDate || deposit.startDate;
                    //monthsDiff = helper.getMonthsDiff(now, lastInterestDate);
                
                // if (monthsDiff < 1) {
                //     return loop.next();
                // }

                i++;
                
                deposit.earnInterest(function(error) {
                     if (error) {
                         throw error;
                     }
                     
                     lastInterestDate = helper.addMonthsToDate(lastInterestDate, 1); 
                     deposit.lastInterestDate = lastInterestDate;
                     
                     deposit.save().then(function() {
                        debug('Deposit transaction successfully passed', 'DepositId: ', deposit.id);
                        loop.next();
                    })
                    .catch(function(error) {
                        throw error;
                    });
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
