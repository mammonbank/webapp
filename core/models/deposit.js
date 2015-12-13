'use strict';

var debug = require('debug')('mammonbank:api'),
    Decimal = require('decimal.js');

Decimal.config({
    precision: 20,
    rounding: 8,
    errors: false
});

/*
    Call Deposit with capitalized interest (per month)
    
    Deposit model fields:
    {
        sum,
        startDate,
        endDate,
        lastInterestDate
    }
*/
module.exports = function (sequelize, DataTypes) {
    var Deposit = sequelize.define('Deposit', {
        sum: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            field: 'sum'
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
        lastInterestDate: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'last_interest_date',
            validate: {
                isDate: true
            }
        }
    }, {
        tableName: 'deposits',
        underscored: true,
        timestamps: true,
        paranoid: true,
        
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
        
        instanceMethods: {
            checkForValidity: function(cb) {
                var self = this;
                this.getDepositType()
                    .then(function(depositType) {
                        var isValid = self.sum >= depositType.minSum;
                        
                        cb(null, isValid);
                    })
                    .catch(function(error) {
                        cb(error);
                    });
            },
            
            calculateInterest: function(cb) {
                var self = this;
                this.getDepositType()
                    .then(function(depositType) {
                        var interest = Math.round(
                            new Decimal(self.sum).times(depositType.interest).div(12).toNumber()
                        );
                        cb(null, interest);
                    })
                    .catch(function(error) {
                        cb(error);
                    });
            },
            
            earnInterest: function(cb) {
                var self = this,
                    BankInfo = sequelize.models.BankInfo;
                    
                this.calculateInterest(function(error, interest) {
                    if (error) {
                        return cb(error);
                    }
                    
                    sequelize.transaction(function(t) {
                        //first - increase deposit's sum
                        return Deposit.update({
                            sum: Math.round(new Decimal(self.sum).plus(interest))
                        }, {
                            where: { id: self.id },
                            transaction: t
                        })
                        //second - find bank info
                        .then(function() {
                            return BankInfo.findById(1, { transaction: t });
                        })
                        //third - decrease bank's moneySupply
                        .then(function(bankInfo) {
                            return BankInfo.update({
                                moneySupply: new Decimal(bankInfo.moneySupply).minus(interest).toNumber()
                            }, {
                                where: { id: 1 },
                                transaction: t
                            });
                        });
                    })
                    //transaction successfully passed
                    .then(function() {
                        cb(null);
                    })
                    //transaction failed
                    .catch(function(error) {
                        cb(error);
                    });
                });
            }
            
        }
        
    });
    
    Deposit.hook('beforeCreate', function(deposit, options, cb) {
        deposit.checkForValidity(function(error, isValid) {
            if (error) {
                debug(error);
                return cb(error);
            }

            if (!isValid) {
                return cb(new sequelize.ValidationError('Deposit validation failed!'));
            }
            
            cb(null, deposit);
        });
    });

    return Deposit;
};
