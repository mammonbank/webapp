'use strict';

/*
    Operator model fields:
    {
        username,
        password
    }
*/
module.exports = function(sequelize, DataTypes) {
    var Operator = sequelize.define('Operator', {
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
        tableName: 'operators',
        underscored: true,
        timestamps: true,
        paranoid: true,
        
        classMethods: {
            associate: function(models) {
                Operator.hasMany(models.CreditApplication);
            }
        },
        
        instanceMethods: {
            
        }
    });

    return Operator;
};
