'use strict';

var HttpApiError = require('error').HttpApiError;

module.exports = function(req, res, next) {
    var depositTypeId = +req.params.depositTypeId || -1;

    if (depositTypeId === -1) {
        return next(new HttpApiError(400, 'Wrong deposit type id'));
    }
    
    req.depositTypeId = depositTypeId;
    next();
};
