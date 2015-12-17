'use strict';

/*
    Manager model fields:
    {
        username,
        password
    }
*/
module.exports = function(sequelize, DataTypes) {
    var Manager = sequelize.define('Manager', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'username',
            unique: true
        },
        //without salting at this time
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'password'
        }
    }, {
        tableName: 'managers',
        underscored: true,
        timestamps: true,
        paranoid: true,
        
        classMethods: {
            associate: function(models) {
                
            }
        },
        
        instanceMethods: {
            
        }
    });

    return Manager;
};
