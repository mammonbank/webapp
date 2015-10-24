'use strict';

var util = require('util');

function HttpApiError(statusCode, message) {
    this.statusCode = statusCode;
    this.message = message;
    // Creates the this.stack getter
    Error.captureStackTrace(this, HttpApiError);
}

util.inherits(HttpApiError, Error);

HttpApiError.prototype.name = 'HttpApiError';

exports.HttpApiError = HttpApiError;