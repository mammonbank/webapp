'use strict';

var HttpApiError = require('error').HttpApiError;

module.exports = function(req, res, next) {
    var operatorId = +req.params.operatorId || -1;

    if (operatorId === -1) {
        return next(new HttpApiError(400, 'Wrong operator id'));
    }
    
    req.operatorId = operatorId;
    next();
};
