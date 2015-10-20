'use strict';

var shelljs = require('shelljs'),
    env = process.env.NODE_ENV || 'development';

shelljs.echo('App is starting in ' + env + ' environment');

if (env === 'production') {
    shelljs.exec('pm2 start client/bin/www -i 0 --name "client"');
    shelljs.exec('pm2 start admin/bin/www -i 0 --name "admin"');
} else {
    shelljs.exec('pm2 start client/bin/www -i 1 --name "client" --watch');
    shelljs.exec('pm2 start admin/bin/www -i 1 --name "admin" --watch');
}

