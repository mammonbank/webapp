'use strict';

var moment = require('moment'),
    util = {};

//may be a fraction
util.getMonthsNumber = function(startDate, endDate) {
    return moment(endDate).diff(moment(startDate), 'months', true);
};

module.exports = util;