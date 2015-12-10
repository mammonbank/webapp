'use strict';

/*
    DepositType model fields:
    {
        percent
        title
        description
        minTerm
        minSum
    }
*/
module.exports = function (sequelize, DataTypes) {
    var DepositType = sequelize.define('DepositType', {
        percent: {
            type: DataTypes.DECIMAL(3, 2),
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
        minTerm: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'min_term',
            
        },
        minSum: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            field: 'min_sum',
            
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
