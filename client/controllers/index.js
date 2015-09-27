var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('index', { message: 'Hello, client!' });
});

module.exports = router;