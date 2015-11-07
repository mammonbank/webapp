'use strict';

var express = require('express'),
    router  = express.Router(),
    Client = require('models').Client,
    jwt = require('jsonwebtoken'),
    config = require('config'),
    HttpApiError = require('error').HttpApiError;

router.post('/authenticate', function(req, res, next) {
    Client
        .findOne({
            where: { email: req.body.email }  
        })
        .then(function(client) {
            if (!client) {
                return next(new HttpApiError(401, 
                    'Authentication failed. Username or password is invalid.'));
            }
            
            client.verifyPassword(req.body.password, function(error, isMatch) {
                if (error) {
                    return next(error);
                }
                
                if (!isMatch) {
                    return next(new HttpApiError(401, 
                        'Authentication failed. Username or password is invalid.'));
                }
                
                var token = jwt.sign({ clientId: client.id }, config.security.tokenSecret, {
                    expiresIn: config.security.tokenExpirationTime
                });
                
                res.json({
                    success: true,
                    token: token
                });
                
            });
        })
        .catch(function(error) {
            next (error);
        });
});

router.get('/', function(req, res, next) {
    res.render('index');
});

module.exports = router;
