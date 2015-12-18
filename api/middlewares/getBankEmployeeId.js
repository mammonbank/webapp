'use strict';

var HttpApiError = require('error').HttpApiError;

module.exports = function(req, res, next) {
    var bankEmployeeId = +req.params.bankEmployeeId || -1;

    if (bankEmployeeId === -1) {
        return next(new HttpApiError(400, 'Wrong bank employee id'));
    }
    
    req.bankEmployeeId = bankEmployeeId;
    next();
};
