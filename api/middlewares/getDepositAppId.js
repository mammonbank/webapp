'use strict';

var HttpApiError = require('error').HttpApiError;

module.exports = function(req, res, next) {
    var depositAppId = +req.params.depositAppId || -1;

    if (depositAppId === -1) {
        return next(new HttpApiError(400, 'Wrong deposit application id'));
    }
    
    req.depositAppId = depositAppId;
    next();
};
