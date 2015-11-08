'use strict';

var HttpApiError = require('error').HttpApiError;

module.exports = function(req, res, next) {
    var creditCatId = +req.params.creditCatId || -1;

    if (creditCatId === -1) {
        return next(new HttpApiError(400, 'Wrong credit category id'));
    }
    
    req.creditCatId = creditCatId;
    next();
};
