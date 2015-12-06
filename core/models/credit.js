'use strict';

var debug = require('debug')('mammonbank:client:db'),
    helper = require('helper'),
    _ = require('lodash'),
    Decimal = require('decimal'),
    BankError = require('error').BankError,
    Sequelize = require('sequelize');

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
        },
        lastPaymentDate: {
            type: DataTypes.DATE,
            allowNull: true,
            field: 'last_payment_date',
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
                            months = helper.getMonthsDiff(self.endDate, self.startDate),
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
                var months = helper.getMonthsDiff(this.endDate, this.startDate);
                return new Decimal(this.sum).div(months).toNumber();
            },
            
            //with interest on loan
            getMonthFee: function(cb) {
                var self = this;

                this.getCreditType()
                    .then(function(creditType) {
                        var percentAmount = new Decimal(self.outstandingLoan)
                                                .mul(creditType.interest)
                                                .div(12);
                        
                        cb( null, percentAmount.add(self.getStaticMonthFee()).toNumber() );
                    })
                    .catch(function(error) {
                        cb(error);
                    });
            },

            //invoked in the scheduler
            payCredit: function(fn) {
                var self = this,
                    ClientAccount = sequelize.models.ClientAccount,
                    BankInfo = sequelize.models.BankInfo;

                this.getMonthFee(function(error, monthFee) {
                    if (error) {
                        return fn(error);
                    }

                    sequelize.transaction({
                        isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED
                    }, function(t) {
                        //first - find corresponding client account
                        return ClientAccount.findOne({
                            where: { client_id: self.client_id },
                            transaction: t
                        })
                        //second - subract credit month fee from account's amount of money
                        .then(function(clientAccount) {
                            if (clientAccount.amount < monthFee) {
                                throw new BankError('Insufficient funds!');
                            }
                            //TODO: handle zero values
                            return ClientAccount.update({
                                amount: new Decimal(clientAccount.amount).sub(monthFee).toNumber()
                            }, {
                                where: { id: clientAccount.id },
                                transaction: t
                            });
                        })
                        //third - decrease outstanding loan
                        .then(function() {
                            return Credit.update({
                                outstandingLoan: new Decimal(self.outstandingLoan)
                                    .sub(self.getStaticMonthFee())
                                    .toNumber()
                            }, {
                                where: { id: self.id },
                                transaction: t
                            });
                        })
                        //fourth - find bank info
                        .then(function() {
                            return BankInfo.findById(1, { transaction: t });
                        })
                        //fifth - increase bank's moneySupply
                        .then(function(bankInfo) {
                            return BankInfo.update({
                                moneySupply: new Decimal(bankInfo.moneySupply).add(monthFee).toNumber()
                            }, {
                                where: { id: 1 },
                                transaction: t
                            });
                        });
                    })
                    //transaction successfully passed
                    .then(function() {
                        fn(null);
                    })
                    //transaction failed
                    .catch(function(error) {
                        fn(error);
                    });

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
                        return fn(new BankError('We are sorry, bank cannot make loans right now'));
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
