var express = require('express');
var router = express.Router();

router.get('/createUser', function(req, res) {
    var Client = req.app.get('models').Client;
    Client.sync({force: true}).then(function() {
        return Client.create({
            firstName: 'Tomas',
            lastName: 'Anderson'
        })
        .then(function() {
            res.render('index', { message: 'User successfully created!' });
        });
    });
});

router.get('/get', function(req, res) {
    var Client = req.app.get('models').Client;
    Client.findAll({
        attributes: ['firstName', 'lastName']
    })
    .then(function(data) {
        res.end( JSON.stringify(data) );
    });
});


router.get('/', function(req, res) {
    res.render('index', { message: 'Index' });
});

module.exports = router;
