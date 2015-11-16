'use strict';

var debug = require('debug')('mammonbank:client:db'),
    moment = require('moment'),
    _ = require('lodash');

/*
    Credit model fields:
    {
        sum,
        startDate,
        endDate
    }
*/
module.exports = function(sequelize, DataTypes) {
    var Credit = sequelize.define('Credit', {
        sum: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            field: 'sum',
            validate: {
                min: 0
            }
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
            allowNull: false,
            field: 'end_date',
            validate: {
                isDate: true
            }
        }
    }, {
        tableName: 'credits',
        underscored: true,
        timestamps: true,
        paranoid: true,
        
        classMethods: {
            associate: function(models) {
                Credit.belongsTo(models.CreditType, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    }
                });
                Credit.belongsTo(models.Client, {
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
                            months = moment(self.endDate).diff(moment(self.startDate), 'months'),
                            isValid = !!( _.inRange(self.sum, creditType.minSum, creditType.maxSum) &&
                                 _.inRange(months, minMonths, maxMonths) );
                        
                        cb(null, isValid);
                    })
                    .catch(function(error) {
                        cb(error);
                    });
            }
        }
    
    });
    
    Credit.hook('beforeCreate', function(credit, options, fn) {
        credit.checkForValidity(function(error, isValid) {
            if (error) {
                debug(error);
                fn(error);
            }

            if (isValid) {
                fn(null, credit);
            } else {
                fn(new sequelize.ValidationError('Credit validation failed!'));
            }
            
        });
    });

    return Credit;
};
