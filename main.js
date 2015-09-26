'use strict';

var shelljs = require('shelljs');
var env = process.env.NODE_ENV || 'development';

shelljs.echo('App is starting in ' + env + ' environment');
shelljs.exec('pm2 start client/app.js -i 0 --name "client"');
shelljs.exec('pm2 start admin/app.js -i 0 --name "admin"');
