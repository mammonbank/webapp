'use strict';

var config = require('config');
var Sequelize = require('sequelize');
var path = require('path');

var sequelize = new Sequelize(
    config.db.dbname, 
    config.db.username, 
    config.db.password, {    
        host: config.db.host,
        dialect: config.db.dialect,
        pool: {
            max: config.db.pool.max,
            min: config.db.pool.min,
            idle: config.db.pool.idle
        }
    }
);

var models = [
    'Client'
];

models.forEach(function(model) {
    module.exports[model] = sequelize.import( path.join(__dirname, model) );
});

module.exports.sequelize = sequelize;

