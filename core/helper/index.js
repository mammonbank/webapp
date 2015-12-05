'use strict';

var moment = require('moment'),
    util = {};

//may be a fraction
util.getMonthsDiff = function(endDate, startDate) {
    return moment(endDate).diff(moment(startDate), 'months', true);
};

module.exports = util;