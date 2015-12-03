'use strict';

var debug = require('debug')('mammonbank:client:error');

module.exports = function(error, req, res, next) {
    debug(error);
 
    res.status(500).json({
       message: error.message,
       error: process.env.NODE_ENV === 'production' ? {} : error 
    });
};
