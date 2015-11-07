'use strict';

var debug = require('debug')('mammonbank:client:error'),
    HttpApiError = require('../index').HttpApiError;

module.exports = function(error, req, res, next) {
    if (error instanceof HttpApiError) {
        debug(error);
        res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    } else {
        next(error);
    }
};
