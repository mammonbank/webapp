'use strict';

module.exports = function(sequelize, DataTypes) {
    var Client = sequelize.define('Client', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'first_name'
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'last_name'
        }
    }, {
        classMethods: {
            
        }
    });

    return Client;
};
