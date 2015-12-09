'use strict';

/*
    Deposit model fields:
    {
        percent
        start_sum
        current_sum
        start_date
        end_date
    }
*/
module.exports = function (sequelize, DataTypes) {
    var Deposit = sequelize.define('Deposit', {
        percent: {
            type: DataTypes.FLOAT,
            allowNull: false,
            field: 'percent',
        },
        startSum: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            field: 'start_sum'
        },
        currentSum: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            field: 'current_sum',
            
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'start_date',
            validate: {
                isDate: true
            }
            
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'end_date',
            validate: {
                isDate: true
            }
        },
    }, {
        tableName: 'deposits',
        underscored: true,
        timestamps: true,
        paranoid: false,
        classMethods: {
            associate: function(models) {
                Deposit.belongsTo(models.DepositType, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    }
                });
                Deposit.belongsTo(models.Client, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        },
    });

    return Deposit;
};
