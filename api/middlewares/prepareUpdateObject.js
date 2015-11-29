'use strict';

module.exports = function(req, res, next) {
    var updateObj = {};
    Object.keys(req.body).forEach(function(key) {
       updateObj[key] = req.body[key]; 
    });
    
    req.updateObj = updateObj;
    next();
};
