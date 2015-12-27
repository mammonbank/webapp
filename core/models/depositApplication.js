'use strict';

var debug = require('debug')('mammonbank:api');

/*
    DepositApplication model fields:
    {
        plannedSum,
        isConfirmed
    }
*/
module.exports = function(sequelize, DataTypes) {
    var DepositApplication = sequelize.define('DepositApplication', {
        plannedSum: {
            type: DataTypes.DECIMAL(16, 2),
            allowNull: false,
            field: 'planned_sum',
            validate: {
                min: 0
            }
        },
        isConfirmed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'is_confirmed'
        }
    }, {
        tableName: 'deposit_applications',
        underscored: true,
        timestamps: true,
        paranoid: true,
        
        classMethods: {
            associate: function(models) {
                DepositApplication.belongsTo(models.Client, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    }
                });
                DepositApplication.belongsTo(models.DepositType, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    }
                });
                DepositApplication.belongsTo(models.BankEmployee, {
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
                        var isValid = self.plannedSum >= depositType.minSum;
                        
                        cb(null, isValid);
                    })
                    .catch(function(error) {
                        cb(error);
                    });
            }
        }
    
    });
    
    DepositApplication.hook('beforeCreate', function(depositApp, options, fn) {
        depositApp.checkForValidity(function(error, isValid) {
            if (error) {
                debug(error);
                fn(error);
            }

            if (isValid) {
                fn(null, depositApp);
            } else {
                fn(new sequelize.ValidationError('Deposit application validation failed!'));
            }
            
        });
    });

    return DepositApplication;
};
