'use strict';

var config = require('config');

module.exports = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', config.server.allowedOrigins.join(','));
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};