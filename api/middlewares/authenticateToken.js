'use strict';

var jwt = require('jsonwebtoken'),
    config = require('config');

module.exports = function(req, res, next) {
    var token = req.headers.authorization || req.body.token || req.query.token;
    
    if (!token) {
        return res.status(404).json({
            success: false,
            message: 'This is not the page you are looking for.'
        });
    }
    
    jwt.verify(token, config.security.tokenSecret, function(error, decoded) {
        if (error) {
            return res.status(403).json({
                success: false,
                message: error.message
            });
        }
        
        req.decoded = decoded;
        next();
    });
};
