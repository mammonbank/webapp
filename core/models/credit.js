'use strict';

var debug = require('debug')('mammonbank:client:db'),
    helper = require('helper'),
    _ = require('lodash'),
    Decimal = require('decimal'),
    BankError = require('error').BankError;

/*
    Credit model fields:
    {
        sum,
        outstandingLoan,
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
        outstandingLoan: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            field: 'outstanding_loan',
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
                            months = helper.getMonthsNumber(self.startDate, self.endDate),
                            isValid = !!( _.inRange(self.sum, creditType.minSum, creditType.maxSum) &&
                                 _.inRange(months, minMonths, maxMonths) );
                        
                        cb(null, isValid);
                    })
                    .catch(function(error) {
                        cb(error);
                    });
            },

            //without interest on loan
            getStaticMonthFee: function() {
                var months = helper.getMonthsNumber(this.startDate, this.endDate);
                return new Decimal(this.sum).div(months).toNumber();
            },
            
            //with interest on loan
            getMonthFee: function(cb) {
                var self = this;

                this.getCreditType()
                    .then(function(creditType) {
                        var percentAmount = new Decimal(self.outstandingLoan)
                                                .times(creditType.interest);
                        cb( null, percentAmount.add(self.getStaticMonthFee).toNumber() );
                    })
                    .catch(function(error) {
                        cb(error);
                    });
            },

            //invoked in the scheduler
            payCredit: function(sum, fn) {
                var self = this;

                this.getMonthFee(function(error, monthFee) {
                    if (error) {
                        return fn(error);
                    }

                    if (sum < monthFee) {
                        return fn(new BankError('The sum is less than month fee!'));
                        //TODO: начислить дополнительную выплату из-за просрочки
                    }

                    self.outstandingLoan = new Decimal(self.outstandingLoan)
                                                .sub(self.getStaticMonthFee())
                                                .toNumber();


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
                        new Decimal(data[0].dataValues.totalSum)
                            .add(credit.sum)
                            .toNumber();
                    return sequelize.models.BankInfo.findById(1);
                })
                .then(function(bankInfo) {
                    //if this is true then bank is made too many loans, so it must stop in order 
                    //to provide immediate liquidity to depositors
                    console.log(totalMoneySupply, bankInfo.getMaxAmountOfMoneySupply());
                    if ( totalMoneySupply > bankInfo.getMaxAmountOfMoneySupply() ) {
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
