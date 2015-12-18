'use strict';

var express = require('express'),
    router  = express.Router(),
    BankEmployee = require('models').BankEmployee,
    jwt = require('jsonwebtoken'),
    config = require('config'),
    HttpApiError = require('error').HttpApiError;

router.post('/', function(req, res, next) {
    BankEmployee
        .findOne({
            where: { username: req.body.username + '' }  
        })
        .then(function(bankEmployee) {
            if (!bankEmployee) {
                return next(new HttpApiError(401, 
                    'Authentication failed. Username or password is invalid.'));
            }
            
            bankEmployee.verifyPassword(req.body.password, function(error, isMatch) {
                if (error) {
                    return next(error);
                }
                
                if (!isMatch) {
                    return next(new HttpApiError(401, 
                        'Authentication failed. Username or password is invalid.'));
                }
                
                var token = jwt.sign({
                    bankEmployeeId: bankEmployee.id,
                    type: bankEmployee.type
                }, config.security.tokenSecret, {
                    expiresIn: config.security.tokenExpirationTime
                });
                
                res.json({
                    token: token
                });
                
            });       
            
        })
        .catch(function(error) {
            next (error);
        });
});

module.exports = router;
