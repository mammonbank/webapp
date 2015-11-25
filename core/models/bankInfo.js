'use strict';

/*
    BankInfo model fields:
    {
        baseMoney
        reserveRatio
    }
*/
module.exports = function(sequelize, DataTypes) {
    var BankInfo = sequelize.define('BankInfo', {
        //every time a bank accepts a deposit this value grows
        baseMoney: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            field: 'base_money',
            validate: {
                min: 0
            }
        },
        //set by a Central Bank. Usually 10%
        reserveRatio: {
            type: DataTypes.DECIMAL(3, 2),
            allowNull: false,
            field: 'reserve_ratio',
            validate: {
                min: 0
            }
        }
    }, {
        tableName: 'bank_info',
        underscored: true,
        timestamps: true,
        paranoid: false,
        
        instanceMethods: {
            //total sum of all our loans cannot exceed this value
            calculateMaxAmountOfMoneySupply: function() {
                return Math.floor(this.baseMoney / this.reserveRatio);
            }
        }
    
    });

    return BankInfo;
};
