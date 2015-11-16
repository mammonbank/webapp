'use strict';

var debug = require('debug')('mammonbank:client:db'),
    _ = require('lodash');

/*
    CreditApplication model fields:
    {
        plannedSum,
        plannedTerm,
        isConfirmed
    }
*/
module.exports = function(sequelize, DataTypes) {
    var CreditApplication = sequelize.define('CreditApplication', {
        plannedSum: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            field: 'planned_sum',
            validate: {
                min: 0
            }
        },
        plannedTerm: {
            type: DataTypes.RANGE(DataTypes.INTEGER),
            allowNull: false,
            field: 'planned_term'
        },
        isConfirmed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'is_confirmed'
        }
    }, {
        tableName: 'credit_applications',
        underscored: true,
        timestamps: true,
        paranoid: true,
        
        classMethods: {
            associate: function(models) {
                CreditApplication.belongsTo(models.Client, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    }
                });
                CreditApplication.belongsTo(models.CreditType, {
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
                this.getCreditType()
                    .then(function(creditType) {
                        var minMonths = creditType.term[0],
                            maxMonths = creditType.term[1],
                            plannedMinMonths = self.plannedTerm[0],
                            plannedMaxMonths = self.plannedTerm[1],
                            isValid = !!( _.inRange(self.plannedSum, creditType.minSum, creditType.maxSum) &&
                                 plannedMinMonths >= minMonths &&
                                 plannedMaxMonths <= maxMonths );
                        
                        cb(null, isValid);
                    })
                    .catch(function(error) {
                        cb(error);
                    });
            }
        }
    
    });
    
    CreditApplication.hook('beforeCreate', function(creditApp, options, fn) {
        creditApp.checkForValidity(function(error, isValid) {
            if (error) {
                debug(error);
                fn(error);
            }

            if (isValid) {
                fn(null, creditApp);
            } else {
                fn(new sequelize.ValidationError('Credit application validation failed!'));
            }
            
        });
    });

    return CreditApplication;
};
