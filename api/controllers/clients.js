'use strict';

var express = require('express'),
    router  = express.Router(),
    //authenticateToken = require('../middlewares/authenticateToken'),
    prepareUpdateObject = require('../middlewares/prepareUpdateObject'),
    getClientId = require('../middlewares/getClientId'),
    Client  = require('models').Client,
    ClientAccount = require('models').ClientAccount,
    Sequelize = require('models').Sequelize,
    sequelize = require('models').sequelize,
    HttpApiError = require('error').HttpApiError,
    speakeasy = require('speakeasy');

router.get('/', function(req, res, next) {
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
    var clientId, 
        key;

    sequelize.transaction(function(t) {
        //first - create client
        return Client.create({
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
        }, { transaction: t })
        //second - generate secret key (used in 2fa)
        .then(function(client) {
            key = speakeasy.generate_key({
                length: 20,
                symbols: true,
                qr_codes: true,
                google_auth_qr: true,
                name: 'mammonbank'
            });
            
            return Client.update({
                secret: key.base32
            }, {
                where: { id: client.id },
                transaction: t
            });
        })
        //third - create client account
        .then(function(client) {
            clientId = client.id;
            return ClientAccount.create({
                amount: 0,
                client_id: client.id
            }, { transaction: t });
        });
    })
    .then(function(client) {
        res.json({
            clientId: client.id,
            key: key
        }); 
    })
    .catch(Sequelize.ValidationError, function(error) {
        next(new HttpApiError(400, error.message));
    })
    .catch(function(error) {
        next(error);
    });
});

router.patch('/:clientId', getClientId, prepareUpdateObject, function(req, res, next) {
    Client
        .update(req.updateObj, {
            where: {
                id: req.clientId
            }
        })
        .then(function() {
            res.json({
                updated: req.clientId
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
