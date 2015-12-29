'use strict';

/*
    Fractional-reserve banking
    
    BankInfo model fields:
    {
        baseMoney,
        moneySupply,
        reserveRatio
    }
*/
module.exports = function(sequelize, DataTypes) {
    var BankInfo = sequelize.define('BankInfo', {
        //baseMoney += deposit * reserveRatio
        //acts as banks' reserves
        baseMoney: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: false,
            field: 'base_money',
            validate: {
                min: 0
            }
        },
        //moneySupply += deposit * (1 - reserveRatio)
        //moneySupply += fee credit
        //moneySupply -= credit
        //acts as banks' lending money
        moneySupply: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: false,
            field: 'money_supply',
            validate: {
                min: 0
            }
        },
        //set by a Central Bank. Usually less than 10%
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
            getMaxAmountOfMoneySupply: function() {
                return this.moneySupply;
            }
        }
    
    });

    return BankInfo;
};
