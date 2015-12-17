'use strict';

/*
    Overseer model fields:
    {
        username,
        password
    }
*/
module.exports = function(sequelize, DataTypes) {
    var Overseer = sequelize.define('overseer', {
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
        tableName: 'overseers',
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

    return Overseer;
};
