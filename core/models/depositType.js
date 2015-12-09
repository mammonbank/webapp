'use strict';

/*
    DepositType model fields:
    {
        percent
        title
        description
    }
*/
module.exports = function (sequelize, DataTypes) {
    var DepositType = sequelize.define('DepositType', {
        percent: {
            type: DataTypes.FLOAT,
            allowNull: false,
            field: 'percent',
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'title',
            validate: {
                is: /^[0-9а-яА-ЯёЁa-z,.'-]+$/i
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'description',
            validate: {
                is: /^[0-9а-яА-ЯёЁa-z,.'-]+$/i
            }
        },
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
