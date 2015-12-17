'use strict';

var HttpApiError = require('error').HttpApiError;

module.exports = function(req, res, next) {
    var managerId = +req.params.managerId || -1;

    if (managerId === -1) {
        return next(new HttpApiError(400, 'Wrong manager id'));
    }
    
    req.managerId = managerId;
    next();
};
