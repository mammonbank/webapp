'use strict';

var HttpApiError = require('error').HttpApiError;

module.exports = function(req, res, next) {
    var creditId = +req.params.creditId || -1;

    if (creditId === -1) {
        return next(new HttpApiError(400, 'Wrong credit id'));
    }
    
    req.creditId = creditId;
    next();
};
