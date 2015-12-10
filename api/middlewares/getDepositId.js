'use strict';

var HttpApiError = require('error').HttpApiError;

module.exports = function(req, res, next) {
    var depositId = +req.params.depositId || -1;

    if (depositId === -1) {
        return next(new HttpApiError(400, 'Wrong deposit id'));
    }
    
    req.depositId = depositId;
    next();
};
