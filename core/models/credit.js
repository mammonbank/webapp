'use strict';

var debug = require('debug')('mammonbank:api'),
    config = require('config'),
    helper = require('helper'),
    _ = require('lodash'),
    Decimal = require('decimal.js'),
    BankError = require('error').BankError,
    banklogic = require('banklogic');

Decimal.config({
    precision: 20,
    rounding: 8,
    errors: false
});

/*
    Credit model fields:
    {
        sum,
        outstandingLoan,
        repaymentType,
        startDate,
        endDate,
        lastPaymentDate,
        numberOfPayments,
        overdueSum
    }
*/
module.exports = function(sequelize, DataTypes) {
    var Credit = sequelize.define('Credit', {
        sum: {
            type: DataTypes.DECIMAL(16, 2),
            allowNull: false,
            field: 'sum',
            validate: {
                min: 0
            }
        },
        outstandingLoan: {
            type: DataTypes.DECIMAL(16, 2),
            allowNull: false,
            field: 'outstanding_loan',
            //rounding issues
            validate: {
                min: -100
            }
        },
        repaymentType: {
            type: DataTypes.ENUM('EQUAL', 'DIFF'),
            allowNull: false,
            field: 'repayment_type'
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
        },
        numberOfPayments: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'number_of_payments',
            validate: {
                min: 0
            }
        },
        overdueSum: {
            type: DataTypes.DECIMAL(16, 2),
            allowNull: false,
            field: 'overdue_sum',
            validate: {
                min: -100
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
                        var minMonths = creditType.minTerm,
                            maxMonths = creditType.maxTerm,
                            months = helper.getMonthsDiff(self.endDate, self.startDate),
                            isValid = !!( _.inRange(self.sum, creditType.minSum, creditType.maxSum + 1) &&
                                 _.inRange(months, minMonths, maxMonths + 1) );
                        
                        cb(null, isValid);
                    })
                    .catch(function(error) {
                        cb(error);
                    });
            },
            
            getCreditRepaymentInfo: function(cb) {
                switch(this.repaymentType) {
                    case 'EQUAL':
                        this.getCreditAnnuityRepaymentInfo(cb);
                        break;
                    case 'DIFF':
                        this.getCreditDifferentiatedRepaymentInfo(cb);
                        break;
                    default:
                        this.getCreditAnnuityRepaymentInfo(cb);
                        break;
                }
            },
            
            getCreditAnnuityRepaymentInfo: function(cb) {
                var self = this;
                
                this.getCreditType()
                    .then(function(creditType) {
                        var creditRepaymentInfo = banklogic.getCreditAnnuityRepaymentInfo({
                            staticFee: self.getStaticFee(),
                            sum: self.sum,
                            startDate: self.startDate,
                            endDate: self.endDate,
                            interest: creditType.interest,
                            title: creditType.title
                        });
                        
                        cb(null, creditRepaymentInfo);
                        
                    })
                    .catch(function(error) {
                        cb(error);
                    });
            },
            
            getCreditDifferentiatedRepaymentInfo: function(cb) {
                var self = this;
                
                this.getCreditType()
                    .then(function(creditType) {
                        var creditRepaymentInfo = banklogic.getCreditDifferentiatedRepaymentInfo({
                            staticFee: self.getStaticFee(),
                            sum: self.sum,
                            startDate: self.startDate,
                            endDate: self.endDate,
                            interest: creditType.interest,
                            title: creditType.title
                        });

                        cb(null, creditRepaymentInfo);

                    })
                    .catch(function(error) {
                        cb(error);
                    });
            },
            
            getTotalNumberOfPayments: function() {
                return Math.ceil( helper.getMonthsDiff(this.endDate, this.startDate) );  
            },
            
            //without interest on loan
            getStaticFee: function() {
                var months = Math.ceil(helper.getMonthsDiff(this.endDate, this.startDate));
                return new Decimal(this.sum).div(months).toNumber();
            },

            //with interest on loan
            getMonthFee: function(paymentNumber, cb) {
                var self = this;
                
                this.getCreditRepaymentInfo(function(error, creditRepaymentInfo) {
                    if (error) {
                        return cb(error);
                    }
                    
                    //standard month fee + overdue fee (if any)
                    var monthFee = Math.round(
                        new Decimal(creditRepaymentInfo.payments[paymentNumber].totalFee)
                            .plus(self.overdueSum).toNumber()
                    );

                    cb(null, monthFee);
                });
            },
            
            getMonthFeeWithoutOverdueSum: function(paymentNumber, cb) {
                this.getCreditRepaymentInfo(function(error, creditRepaymentInfo) {
                    if (error) {
                        return cb(error);
                    }

                    cb(null, creditRepaymentInfo.payments[paymentNumber].totalFee);
                });
            },

            //invoked in the scheduler
            payCredit: function(paymentNumber, cb) {
                var self = this,
                    ClientAccount = sequelize.models.ClientAccount,
                    BankInfo = sequelize.models.BankInfo;
                
                //credit has been repaid
                //why not zero: rounding issues
                if (this.outstandingLoan <= 10) {
                    return cb(null, true);
                }

                this.getMonthFee(this.numberOfPayments, function(error, monthFee) {
                    if (error) {
                        return cb(error);
                    }
                    
                    sequelize.transaction(function(t) {
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
                            
                            return ClientAccount.update({
                                amount: new Decimal(clientAccount.amount).minus(monthFee).toNumber()
                            }, {
                                where: { id: clientAccount.id },
                                transaction: t
                            });
                        })
                        //third - decrease outstanding loan
                        .then(function() {
                            return Credit.update({
                                outstandingLoan: new Decimal(self.outstandingLoan)
                                    .minus(self.getStaticFee())
                                    .toNumber(),
                                numberOfPayments: self.numberOfPayments + 1
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
                                moneySupply: new Decimal(bankInfo.moneySupply).plus(monthFee).toNumber()
                            }, {
                                where: { id: 1 },
                                transaction: t
                            });
                        });
                    })
                    //transaction successfully passed
                    .then(function() {
                        cb(null, false);
                    })
                    //transaction failed
                    .catch(function(error) {
                        cb(error);
                    });

                });
            },
            
            setOverduePayment: function(cb) {
                var self = this;
                
                this.getMonthFeeWithoutOverdueSum(this.numberOfPayments, function(error, monthFee) {
                    if (error) {
                        return cb(error);
                    }

                    var overduePayment = Math.round( 
                        new Decimal(monthFee).times(config.bank.credits.overduePercent) 
                    );

                    Credit.update({
                        overdueSum: Math.round(
                            new Decimal(self.overdueSum).plus(overduePayment)
                        )
                    }, {
                        where: { id: self.id }
                    })
                    .then(function() {
                        cb(null, overduePayment);
                    })
                    .catch(function(error) {
                        cb(error);
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
                        new Decimal(data[0].dataValues.totalSum || 0)
                            .plus(credit.sum)
                            .toNumber();
                    return sequelize.models.BankInfo.findById(1);
                })
                .then(function(bankInfo) {
                    //if this is true then bank is made too many loans, so it must stop in order 
                    //to provide immediate liquidity to depositors
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
