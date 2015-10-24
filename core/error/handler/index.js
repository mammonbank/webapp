'use strict';

var debug = require('debug')('mammonbank:client:error');

module.exports = function(error, req, res, next) {
    res.status(500);
    debug(error);
    
    if (process.env.NODE_ENV === 'production') {
        res.render('500', {
            message: error.message,
            error: {}
        });
    } else {
        res.render('500', {
            message: error.message,
            error: error
        });
    }
};