'use strict';

var express = require('express'),
    router  = express.Router(),
    authenticateToken = require('../middlewares/authenticateToken'),
    getClientId = require('../middlewares/getClientId'),
    Client  = require('models').Client;

router.get('/', authenticateToken, function(req, res, next) {
    var offset = +req.query.offset || 0,
        limit = +req.query.limit || 50;

    Client
        .findAll({ offset: offset, limit: limit })
        .then(function(clients) {
            res.json({
                count: clients.length,
                offset: offset,
                limit: limit,
                clients: clients
            });
        })
        .catch(function(error) {
            next(error);
        });
});

router.get('/:clientId', getClientId, function(req, res, next) {
    Client
        .findById(req.clientId)
        .then(function(client) {
            if (!client) {
                return res.json({
                    message: 'No client has been found with given id'    
                });
            }
            
            res.json(client);
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
            patronymic: req.body.patronymic,
            dateOfBirth: req.body.dateOfBirth,
            phoneNumber: req.body.phoneNumber,
            email: req.body.email,
            password: req.body.password,
            passportNumber: req.body.passportNumber,
            passportIdNumber: req.body.passportIdNumber,
            mothersMaidenName: req.body.mothersMaidenName
        })
        .then(function(client) {
            res.json({
                clientId: client.id
            });
        })
        .catch(function(error) {
            next(error);
        });
});

router.delete('/:clientId', getClientId, function(req, res, next) {
    Client
        .destroy({
            where: { id: req.clientId }
        })
        .then(function() {
            res.json({
                clientId: req.clientId
            });
        })
        .catch(function(error) {
            next(error);
        });
});

module.exports = router;
