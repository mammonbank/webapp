'use strict';

var jwt = require('jsonwebtoken'),
    config = require('config'),
    HttpApiError = require('error').HttpApiError;

module.exports = function(req, res, next) {
    var token = req.headers.authorization || req.body.token || req.query.token;
    
    if (!token) {
        return next(new HttpApiError(404, 'This is not the page you are looking for.'));
    }
    
    jwt.verify(token, config.security.tokenSecret, function(error, decoded) {
        if (error) {
            return next(new HttpApiError(403, error.message));
        }
        
        req.decoded = decoded;
        next();
    });
};
