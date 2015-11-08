'use strict';

var HttpApiError = require('error').HttpApiError;

module.exports = function(req, res, next) {
    var creditAppId = +req.params.creditAppId || -1;

    if (creditAppId === -1) {
        return next(new HttpApiError(400, 'Wrong credit application id'));
    }
    
    req.creditAppId = creditAppId;
    next();
};
