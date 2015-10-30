'use strict';

var fs         = require('fs'),
    path       = require('path'),
    debug      = require('debug')('mammonbank:client:db'),
    Sequelize  = require('sequelize'),
    config     = require('config'),
    sequelize  = new Sequelize(
        config.db.dbname, 
        config.db.username, 
        config.db.password, {    
            host: config.db.host,
            dialect: config.db.dialect,
            pool: {
                max: config.db.pool.max,
                min: config.db.pool.min,
                idle: config.db.pool.idle
            },
            logging: function(message) {
                debug(message);
            }
        }
    ),
    db = {};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach(function(file) {
        var model = sequelize.import(path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
