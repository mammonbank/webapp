'use strict';

var config = require('config');

module.exports = function(req, res, next) {
    var origin = req.protocol + '://' + req.get('host');
    
    if (config.server.allowedOrigins.indexOf(origin) === -1) {
        return next(new Error('Origin is not allowed!'));
    }
    
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,PATCH,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
};