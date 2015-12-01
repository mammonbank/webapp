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


function BankError(message) {
    this.message = message;
    Error.captureStackTrace(this, BankError);
}

util.inherits(BankError, Error);

BankError.prototype.name = 'BankError';

exports.BankError = BankError;
