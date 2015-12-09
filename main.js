'use strict';

var shelljs = require('shelljs'),
    config = require('config'),
    env = process.env.NODE_ENV || 'development';

shelljs.echo('App is starting in ' + env + ' environment');

if (env === 'production') {
    shelljs.exec('pm2 start api/bin/www -i 0 --name "api"');
    shelljs.exec('pm2 start client/bin/www -i 0 --name "client"');
    shelljs.exec('pm2 start bank/bin/www -i 0 --name "bank"');
    
    if (config.cron.isEnabled) {
        shelljs.echo('Starting cron jobs');
        shelljs.exec('pm2 start scheduler.js -i 0 --name "cron"');
    }
    
} else {
    shelljs.exec('pm2 start api/bin/www -i 1 --name "api"');
    shelljs.exec('pm2 start client/bin/www -i 1 --name "client"');
    shelljs.exec('pm2 start bank/bin/www -i 1 --name "bank"');
    
    if (config.cron.isEnabled) {
        shelljs.echo('Starting cron jobs');
        shelljs.exec('pm2 start scheduler.js -i 1 --name "cron"');
    }
    
}
