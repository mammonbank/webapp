'use strict';

var HttpApiError = require('error').HttpApiError;

module.exports = function(req, res, next) {
    var creditTypeId = +req.params.creditTypeId || -1;

    if (creditTypeId === -1) {
        return next(new HttpApiError(400, 'Wrong credit type id'));
    }
    
    req.creditTypeId = creditTypeId;
    next();
};
