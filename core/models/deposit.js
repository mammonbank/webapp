'use strict';

var debug = require('debug')('mammonbank:api');

/*
    Deposit model fields:
    {
        startSum,
        currentSum,
        startDate,
        endDate,
        numberOfMonths
    }
*/
module.exports = function (sequelize, DataTypes) {
    var Deposit = sequelize.define('Deposit', {
        startSum: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            field: 'start_sum'
        },
        currentSum: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            field: 'current_sum'
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
        //how much time the bank has this deposit
        numberOfMonths: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'number_of_months'
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
                        var isValid = self.startSum >= depositType.minSum;
                        
                        cb(null, isValid);
                    })
                    .catch(function(error) {
                        cb(error);
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
