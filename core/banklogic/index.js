'use strict';

var helper = require('helper'),
    Decimal = require('decimal.js'),
    banklogic = {};

Decimal.config({
    precision: 20,
    rounding: 8,
    errors: false
});

//equal payments
//http://myfin.by/wiki/term/annuitetnyj-platyozh
banklogic.getCreditAnnuityRepaymentInfo = function(info) {
    var creditRepaymentInfo = {},
        numberOfPayments = Math.ceil( helper.getMonthsDiff(info.endDate, info.startDate) ),
        staticFee = info.staticFee,
        outstandingLoan = new Decimal(info.sum).minus(staticFee).toNumber(),
        paymentDate = helper.addMonthsToDate(info.startDate, 1),
        totalFee = new Decimal(this.getAnnuityCoefficient(info.interest, numberOfPayments))
                        .times(info.sum)
                        .toNumber();
    
    creditRepaymentInfo.sum = info.sum;
    creditRepaymentInfo.startDate = info.startDate;
    creditRepaymentInfo.endDate = info.endDate;
    creditRepaymentInfo.title = info.title;
    creditRepaymentInfo.interest = info.interest;
    creditRepaymentInfo.payments = [];
    
    for (let i = 0; i < numberOfPayments; i++) {
        creditRepaymentInfo.payments.push({
            paymentNumber: i + 1,
            paymentDate: paymentDate,
            staticFee: Math.round(staticFee),
            percentFee: Math.round(new Decimal(totalFee).minus(staticFee).toNumber()),
            totalFee: Math.round(totalFee),
            outstandingLoan: Math.round(outstandingLoan)
        });
        
        if (helper.getMonthsDiff(info.endDate, paymentDate) < 1) {
            paymentDate = info.endDate;
        } else {
            paymentDate = helper.addMonthsToDate(paymentDate, 1);
        }
        
        if (outstandingLoan <= staticFee) {
            outstandingLoan = 0;
        } else {
            outstandingLoan = new Decimal(outstandingLoan).minus(staticFee).toNumber();
        }
    }
    
    creditRepaymentInfo.totalFee = Math.round(new Decimal(totalFee)
        .times(numberOfPayments)
        .toNumber());
    creditRepaymentInfo.totalPercentFee = Math.round(new Decimal(creditRepaymentInfo.totalFee)
        .minus(info.sum)
        .toNumber());
    //1.7 - some random coefficient
    creditRepaymentInfo.preferredIncome = Math.round(new Decimal(creditRepaymentInfo.payments[0].totalFee)
        .times(1.7)
        .toNumber());
    
    return creditRepaymentInfo;
};

//formula: 
//( monthInterest * (1 + monthInterest )^numberOfPayments  ) /
//( (1 + monthInterest )^numberOfPayments - 1 )
banklogic.getAnnuityCoefficient = function(interest, numberOfPayments) {
    var monthInterest = new Decimal(interest).div(12).toNumber(),
        temp = new Decimal(monthInterest).plus(1).pow(numberOfPayments),
        numerator = temp.times(monthInterest),
        denominator = temp.minus(1);
    return new Decimal(numerator).div(denominator).toNumber();
};

//http://myfin.by/wiki/term/differencirovannye-platezhi
banklogic.getCreditDifferentiatedRepaymentInfo = function(info) {
    var creditRepaymentInfo = {},
        numberOfPayments = Math.ceil( helper.getMonthsDiff(info.endDate, info.startDate) ),
        staticFee = Math.round(info.staticFee),
        outstandingLoan = Math.round(new Decimal(info.sum).minus(staticFee).toNumber()),
        paymentDate = helper.addMonthsToDate(info.startDate, 1),
        percentFee = Math.round(this.getPercentFee(info.sum, info.interest, paymentDate)),
        totalFee = new Decimal(0);

    creditRepaymentInfo.sum = info.sum;
    creditRepaymentInfo.startDate = info.startDate;
    creditRepaymentInfo.endDate = info.endDate;
    creditRepaymentInfo.title = info.title;
    creditRepaymentInfo.interest = info.interest;
    creditRepaymentInfo.payments = [];
    
    for (let i = 0; i < numberOfPayments; i++) {
        creditRepaymentInfo.payments.push({
            paymentNumber: i + 1,
            paymentDate: paymentDate,
            staticFee: staticFee,
            percentFee: percentFee,
            totalFee: Math.round(new Decimal(staticFee).plus(percentFee).toNumber()),
            outstandingLoan: outstandingLoan
        });

        if (helper.getMonthsDiff(info.endDate, paymentDate) < 1) {
            paymentDate = info.endDate;
        } else {
            paymentDate = helper.addMonthsToDate(paymentDate, 1);
        }
        
        if (outstandingLoan <= staticFee) {
            outstandingLoan = 0;
        } else {
            percentFee = Math.round(this.getPercentFee(outstandingLoan, info.interest, paymentDate));
            outstandingLoan = Math.round(new Decimal(outstandingLoan).minus(staticFee).toNumber());
        }
        
        totalFee = Math.round(
            new Decimal(totalFee).plus(creditRepaymentInfo.payments[i].totalFee).toNumber()
        );
    }
    
    creditRepaymentInfo.totalFee = totalFee;
    creditRepaymentInfo.totalPercentFee = new Decimal(totalFee).minus(info.sum);
    creditRepaymentInfo.preferredIncome = Math.round(new Decimal(creditRepaymentInfo.payments[0].totalFee)
        .times(1.3)
        .toNumber());
    
    return creditRepaymentInfo;
};

banklogic.getPercentFee = function(outstandingLoan, interest, paymentDate) {
    return new Decimal(outstandingLoan)
            .times(interest)
            .div(helper.isLeapYear(paymentDate.getFullYear()) ? 366: 365)
            .times(helper.getDaysInMonth(paymentDate.getMonth() + 1, paymentDate.getFullYear()))
            .toNumber();
};


module.exports = banklogic;
