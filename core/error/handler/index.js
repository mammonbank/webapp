'use strict';

var debug = require('debug')('mammonbank:client:error');

module.exports = function(error, req, res, next) {
    res.status(500);
    debug(error);
    
    res.render('500', {
       message: error.message,
       error: process.env.NODE_ENV === 'production' ? {} : error 
    });
};
