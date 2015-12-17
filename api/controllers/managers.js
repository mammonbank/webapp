'use strict';

var express = require('express'),
    router  = express.Router(),
    //authenticateToken = require('../middlewares/authenticateToken'),
    prepareUpdateObject = require('../middlewares/prepareUpdateObject'),
    getManagerId = require('../middlewares/getManagerId'),
    Manager  = require('models').Manager,
    Sequelize = require('models').Sequelize,
    HttpApiError = require('error').HttpApiError;

router.get('/', function(req, res, next) {
    var offset = +req.query.offset || 0,
        limit = +req.query.limit || 50;

    Manager
        .findAll({ offset: offset, limit: limit })
        .then(function(managers) {
            res.json({
                count: managers.length,
                offset: offset,
                limit: limit,
                managers: managers
            });
        })
        .catch(function(error) {
            next(error);
        });
});

router.get('/:managerId', getManagerId, function(req, res, next) {
    Manager
        .findById(req.managerId)
        .then(function(manager) {
            if (!manager) {
                return res.json({
                    message: 'No manager has been found with given id'    
                });
            }
            
            res.json(manager);
        })
        .catch(function(error) {
            next(error);
        });
});

router.post('/', function(req, res, next) {
    Manager
        .create({
            username: req.body.username,
            password: req.body.password
        })
        .then(function(manager) {            
            res.json({
                managerId: manager.id
            }); 
        })
        .catch(Sequelize.ValidationError, function(error) {
            next(new HttpApiError(400, error.message));
        })
        .catch(function(error) {
            next(error);
        });
});

router.patch('/:managerId', getManagerId, prepareUpdateObject, function(req, res, next) {
    Manager
        .update(req.updateObj, {
            where: {
                id: req.managerId
            },
            individualHooks: true
        })
        .then(function() {
            res.json({
                updated: req.managerId
            });
        })
        .catch(Sequelize.ValidationError, function(error) {
            next(new HttpApiError(400, error.message));
        })
        .catch(function(error) {
            next(error);
        });
});

router.delete('/:managerId', getManagerId, function(req, res, next) {
    Manager
        .destroy({
            where: { id: req.managerId }
        })
        .then(function() {
            res.json({
                managerId: req.managerId
            });
        })
        .catch(function(error) {
            next(error);
        });
});

module.exports = router;
