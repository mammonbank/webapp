'use strict';

var express = require('express'),
    router  = express.Router(),
    Client  = require('models').Client,
    HttpApiError = require('error').HttpApiError;

router.get('/', function(req, res, next) {
    var offset = +req.query.offset || 0,
        limit = +req.query.limit || 50;
        
    Client
        .findAll({ offset: offset, limit: limit })
        .then(function(clients) {
            res.end(JSON.stringify({
                count: clients.length,
                offset: offset,
                limit: limit,
                clients: clients
            }));
        })
        .catch(function(error) {
            next(error);
        });
});

router.get('/:clientId', function(req, res, next) {
    var clientId = +req.params.clientId || -1;
    
    if (clientId === -1) {
        return next(new HttpApiError(400, 'Wrong client id'));
    }
    
    Client
        .findById(clientId)
        .then(function(client) {
            res.end(JSON.stringify(client));
        })
        .catch(function(error) {
            next(error);
        });
});

router.post('/', function(req, res, next) {
    Client
        .create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
            phoneNumber: req.body.phoneNumber
        })
        .then(function(client) {
            res.end(JSON.stringify({
                clientId: client.id
            }));
        })
        .catch(function(error) {
            next(error);
        });
});

router.delete('/:clientId', function(req, res, next) {
    var clientId = +req.params.clientId || -1;
    
    if (clientId === -1) {
        return next(new HttpApiError(400, 'Wrong client id'));
    }
    
    Client
        .destroy({
            where: { id: clientId }
        })
        .then(function() {
            res.end(JSON.stringify());
        })
        .catch(function(error) {
            next(error);
        });
});

module.exports = router;
