'use strict';

var HttpApiError = require('error').HttpApiError;

module.exports = function(req, res, next) {
    var clientId = +req.params.clientId || -1;

    if (clientId === -1) {
        return next(new HttpApiError(400, 'Wrong client id'));
    }
    
    req.clientId = clientId;
    next();
};
