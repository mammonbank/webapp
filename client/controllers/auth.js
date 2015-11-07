'use strict';

var express = require('express'),
    router  = express.Router(),
    Client = require('models').Client,
    jwt = require('jsonwebtoken'),
    config = require('config'),
    HttpApiError = require('error').HttpApiError,
    speakeasy = require('speakeasy');

router.post('/step-1', function(req, res, next) {
    Client
        .findOne({
            where: { passportIdNumber: req.body.passportIdNumber }  
        })
        .then(function(client) {
            if (!client) {
                return next(new HttpApiError(401, 
                    'Authentication failed. PassportIdNumber or password is invalid.'));
            }
            
            client.verifyPassword(req.body.password, function(error, isMatch) {
                if (error) {
                    return next(error);
                }
                
                if (!isMatch) {
                    return next(new HttpApiError(401, 
                        'Authentication failed. PassportIdNumber or password is invalid.'));
                }
                
                res.json({
                    success: true,
                    clientId: client.id
                });
                
            });
        })
        .catch(function(error) {
            next (error);
        });
});

router.post('/step-2', function(req, res, next) {
    var clientId = +req.body.clientId || -1;
    
    if (clientId === -1) {
        return next(new HttpApiError(404, 'This is not the page you are looking for'));
    }
    
    Client
        .findById(clientId)
        .then(function(client) {
            if (!client) {
                return next(new HttpApiError(404, 'This is not the page you are looking for'));
            }
            
            var oneTimePassword = +speakeasy.totp({
                key: client.secret,
                encoding: 'base32'
            });

            if (oneTimePassword !== req.body.oneTimePassword) {
                return next(new HttpApiError(401, 'Wrong code!'));
            }
            
            var token = jwt.sign({ clientId: client.id }, config.security.tokenSecret, {
                expiresIn: config.security.tokenExpirationTime
            });
            
            res.json({
                success: true,
                token: token
            });
        })
        .catch(function(error) {
            next(error);
        });
});

module.exports = router;
