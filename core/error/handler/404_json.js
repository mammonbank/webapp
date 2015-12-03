'use strict';

module.exports = function(req, res, next) {
    res.status(404).json({
        message: 'This is not the page you are looking for'
    });
};
