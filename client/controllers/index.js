'use strict';

var express = require('express'),
    models  = require('models'),
    router  = express.Router(),
    client = models.Client;

router.get('/', function(req, res) {
    client
        .findAll()
        .then(function(clients) {
            res.end(JSON.stringify(clients));
        });
});

router.post('/create', function(req, res) {
    var reqBody = req.body;

    client
        .create({
            firstName: reqBody.firstName,
            lastName: reqBody.lastName
        })
        .then(function() {
            res.redirect('/');
        });
});

router.delete('/delete', function(req, res) {
    client
        .destroy({
            where: { id: req.body.client_id }
        })
        .then(function() {
            res.redirect('/');
        });
});

module.exports = router;
