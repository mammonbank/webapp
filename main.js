'use strict';

var shelljs = require('shelljs'),
    cron = require('./cron'),
    env = process.env.NODE_ENV || 'development';

shelljs.echo('App is starting in ' + env + ' environment');

// if (env === 'production') {
//     shelljs.exec('pm2 start api/bin/www -i 0 --name "api"');
// } else {
//     shelljs.exec('pm2 start api/bin/www -i 1 --name "api"');
// }

cron.startJobs();