'use strict';

var express = require('express');
var models  = require('models');
var router  = express.Router();

router.get('/', function(req, res) {
    models.Client
        .findAll()
        .then(function(clients) {
            res.end(JSON.stringify(clients));
        });
});

router.post('/create', function(req, res) {
    models.Client.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName
    })
    .then(function() {
        res.redirect('/');
    });
});

router.delete('/delete', function(req, res) {
    models.Client.destroy({
        where: {
            id: req.body.client_id
        }
    })
    .then(function() {
        res.redirect('/');
    });
});

module.exports = router;
