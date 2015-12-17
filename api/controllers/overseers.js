'use strict';

var express = require('express'),
    router  = express.Router(),
    //authenticateToken = require('../middlewares/authenticateToken'),
    prepareUpdateObject = require('../middlewares/prepareUpdateObject'),
    getOverseerId = require('../middlewares/getOverseerId'),
    Overseer  = require('models').Overseer,
    Sequelize = require('models').Sequelize,
    HttpApiError = require('error').HttpApiError;

router.get('/', function(req, res, next) {
    var offset = +req.query.offset || 0,
        limit = +req.query.limit || 50;

    Overseer
        .findAll({ offset: offset, limit: limit })
        .then(function(overseers) {
            res.json({
                count: overseers.length,
                offset: offset,
                limit: limit,
                overseers: overseers
            });
        })
        .catch(function(error) {
            next(error);
        });
});

router.get('/:OverseerId', getOverseerId, function(req, res, next) {
    Overseer
        .findById(req.overseerId)
        .then(function(overseer) {
            if (!overseer) {
                return res.json({
                    message: 'No overseer has been found with given id'    
                });
            }
            
            res.json(overseer);
        })
        .catch(function(error) {
            next(error);
        });
});

router.post('/', function(req, res, next) {
    Overseer
        .create({
            username: req.body.username,
            password: req.body.password
        })
        .then(function(overseer) {            
            res.json({
                overseerId: overseer.id
            }); 
        })
        .catch(Sequelize.ValidationError, function(error) {
            next(new HttpApiError(400, error.message));
        })
        .catch(function(error) {
            next(error);
        });
});

router.patch('/:overseerId', getOverseerId, prepareUpdateObject, function(req, res, next) {
    Overseer
        .update(req.updateObj, {
            where: {
                id: req.overseerId
            },
            individualHooks: true
        })
        .then(function() {
            res.json({
                updated: req.overseerId
            });
        })
        .catch(Sequelize.ValidationError, function(error) {
            next(new HttpApiError(400, error.message));
        })
        .catch(function(error) {
            next(error);
        });
});

router.delete('/:overseerId', getOverseerId, function(req, res, next) {
    Overseer
        .destroy({
            where: { id: req.overseerId }
        })
        .then(function() {
            res.json({
                overseerId: req.overseerId
            });
        })
        .catch(function(error) {
            next(error);
        });
});

module.exports = router;
