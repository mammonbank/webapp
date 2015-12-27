'use strict';

/*
    DepositType model fields:
    {
        title,
        description,
        interest,
        minSum
    }
*/
module.exports = function (sequelize, DataTypes) {
    var DepositType = sequelize.define('DepositType', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'title',
            unique: true,
            validate: {
                is: /^[0-9а-яА-ЯёЁa-z,.'-]+$/i
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'description'
        },
        interest: {
            type: DataTypes.DECIMAL(3, 3),
            allowNull: false,
            field: 'interest',
            validate: {
                max: 1
            }
        },
        minSum: {
            type: DataTypes.DECIMAL(16, 2),
            allowNull: false,
            field: 'min_sum',
            //rounding issues
            validate: {
                min: -100
            }
        }
    }, {
        tableName: 'deposit_types',
        underscored: true,
        timestamps: true,
        paranoid: false,
        classMethods: {
            associate: function (models) {
                DepositType.hasMany(models.Deposit);
            }
        }
    });

    return DepositType;
};
