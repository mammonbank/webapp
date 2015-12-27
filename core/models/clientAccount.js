'use strict';

var Decimal = require('decimal.js');

Decimal.config({
    precision: 20,
    rounding: 8,
    errors: false
});

/*
    ClientAccount model fields:
    {
        amount
    }
*/
module.exports = function(sequelize, DataTypes) {
    var ClientAccount = sequelize.define('ClientAccount', {
        amount: {
            type: DataTypes.DECIMAL(16, 2),
            allowNull: false,
            field: 'amount',
            validate: {
                min: 0
            }
        }
    }, {
        tableName: 'client_account',
        underscored: true,
        timestamps: true,
        paranoid: true,
        
        classMethods: {
            associate: function(models) {
                ClientAccount.belongsTo(models.Client, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        },
        
        instanceMethods: {
            deposit: function(sum, cb) {
                var self = this,
                    BankInfo = sequelize.models.BankInfo,
                    amount;
                
                sequelize.transaction(function(t) {
                    amount = new Decimal(self.amount).plus(sum).toNumber();
                    //first increase client account's amount of money
                    return ClientAccount.update({
                        amount: amount
                    }, {
                        where: { id: self.id },
                        transaction: t
                    })
                    //second - find bank info
                    .then(function() {
                        return BankInfo.findById(1, { transaction: t });
                    })
                    //third - increase bank's baseMoney
                    .then(function(bankInfo) {
                        return BankInfo.update({
                            baseMoney: new Decimal(bankInfo.baseMoney).plus(sum).toNumber()
                        }, {
                            where: { id: 1 },
                            transaction: t
                        });
                    });
                })
                //transaction successfully passed
                .then(function() {
                    cb(null, amount);
                })
                //transaction failed
                .catch(function(error) {
                    cb(error);
                });
            },
            
            withdraw: function(sum, cb) {
                var self = this,
                    BankInfo = sequelize.models.BankInfo,
                    amount;
                
                sequelize.transaction(function(t) {
                    amount = new Decimal(self.amount).minus(sum).toNumber();
                    //first decrease client account's amount of money
                    return ClientAccount.update({
                        amount: amount
                    }, {
                        where: { id: self.id },
                        transaction: t
                    })
                    //second - find bank info
                    .then(function() {
                        return BankInfo.findById(1, { transaction: t });
                    })
                    //third - decrease bank's baseMoney
                    .then(function(bankInfo) {
                        return BankInfo.update({
                            baseMoney: new Decimal(bankInfo.baseMoney).minus(sum).toNumber()
                        }, {
                            where: { id: 1 },
                            transaction: t
                        });
                    });
                })
                //transaction successfully passed
                .then(function() {
                    cb(null, amount);
                })
                //transaction failed
                .catch(function(error) {
                    cb(error);
                });
            }
        }
    
    });

    return ClientAccount;
};
