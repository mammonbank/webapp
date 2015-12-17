'use strict';

/*
    Operator model fields:
    {
        username,
        password,
        numberOfApplications
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
        },
        //both - credit and deposit
        numberOfApplications: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'number_of_applications'
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
