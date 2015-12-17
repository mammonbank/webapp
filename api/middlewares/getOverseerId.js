'use strict';

var HttpApiError = require('error').HttpApiError;

module.exports = function(req, res, next) {
    var overseerId = +req.params.overseerId || -1;

    if (overseerId === -1) {
        return next(new HttpApiError(400, 'Wrong overseer id'));
    }
    
    req.overseerId = overseerId;
    next();
};
