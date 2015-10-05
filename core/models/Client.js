'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Client', {
        firstName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'clients'
    });
};

