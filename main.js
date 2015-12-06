'use strict';

var shelljs = require('shelljs'),
    env = process.env.NODE_ENV || 'development';

shelljs.echo('App is starting in ' + env + ' environment');

if (env === 'production') {
    shelljs.exec('pm2 start api/bin/www -i 0 --name "api"');
    shelljs.exec('cd bem && pm2 start client -i 0 --name "client"');
    shelljs.exec('cd bem && pm2 start bank -i 0 --name "bank"');
} else {
    shelljs.exec('pm2 start api/bin/www -i 1 --name "api"');
    shelljs.exec('cd bem && pm2 start client -i 1 --name "client"');
    shelljs.exec('cd bem && pm2 start bank -i 1 --name "bank"');
}
