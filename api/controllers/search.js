var express = require('express'),
    router  = express.Router(),
    authenticateOperatorToken = require('../middlewares/authenticateOperatorToken'),
    Client  = require('models').Client;

router.get('/clients', authenticateOperatorToken, function(req, res, next) {
    var searchQuery = '%' + req.query.q + '%';
    Client
        .findAll({
            where: {
                $or: [
                    {
                        firstName: {
                            $iLike: searchQuery
                        }
                    },
                    {
                        lastName: {
                            $iLike: searchQuery
                        }
                    },
                    {
                        patronymic: {
                            $iLike: searchQuery
                        }
                    },
                    {
                        phoneNumber: {
                            $iLike: searchQuery
                        }
                    },
                    {
                        email: {
                            $iLike: searchQuery
                        }
                    },
                    {
                        passportNumber: {
                            $iLike: searchQuery
                        }
                    },
                    {
                        passportIdNumber: {
                            $iLike: searchQuery
                        }
                    }
                ]
            }
        })
        .then(function(clients) {
            res.json({
                count: clients.length,
                clients: clients
            });
        })
        .catch(function(error) {
            next(error);
        });
});

module.exports = router;
