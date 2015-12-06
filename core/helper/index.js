'use strict';

var moment = require('moment'),
    helper = {};

//may be a fraction
helper.getMonthsDiff = function(endDate, startDate) {
    return moment(endDate).diff(moment(startDate), 'months', true);
};

helper.addMonthsToDate = function(date, monthsNumber) {
    return moment(date).add(monthsNumber, 'months').toDate();
};

helper.isLeapYear = function(year) {
    return moment([year]).isLeapYear();  
};

//Month is 1 based
helper.getDaysInMonth = function(month, year) {
    return new Date(year, month, 0).getDate();  
};

module.exports = helper;