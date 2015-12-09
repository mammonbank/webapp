'use strict';

var config = require('./core/config'),
    cron = require('./cron');

if (config.cron.isEnabled) {
    cron.startJobs();
}
