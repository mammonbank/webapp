'use strict';

var debug = require('debug')('mammonbank:client:db'),
    moment = require('moment'),
    _ = require('lodash'),
    Decimal = require('decimal');

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
                return fn(error);
            }

            if (!isValid) {
                return fn(new sequelize.ValidationError('Credit validation failed!'));
            }

            var totalMoneySupply;

            Credit
                .findAll({
                    attributes: [
                        [sequelize.fn('SUM', sequelize.col('sum')), 'totalSum']
                    ]
                })
                .then(function(data) {
                    totalMoneySupply =
                        new Decimal(data[0].dataValues.totalSum).add(credit.sum);
                    return sequelize.models.BankInfo.findById(1);
                })
                .then(function(bankInfo) {
                    //if this is true then bank is made too many loans, so it must stop in order 
                    //to provide immediate liquidity to depositors
                    if ( totalMoneySupply > bankInfo.calculateMaxAmountOfMoneySupply() ) {
                        return fn(new Error('We are sorry, bank cannot make loans right now'));
                    }

                    fn(null, credit);
                })
                .catch(function(error) {
                    fn(error);
                });

        });
    });

    return Credit;
};
