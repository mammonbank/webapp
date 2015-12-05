'use strict';

var CronJob = require('cron').CronJob;

module.exports = function(cronTime) {
    var job = new CronJob({
        cronTime: cronTime,
        onTick: function() {
            console.log('tuck');
        },
        start: false
    });
    
    return job;
};
