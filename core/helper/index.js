'use strict';

var moment = require('moment'),
    helper = {};

//may be a fraction
helper.getMonthsDiff = function(endDate, startDate) {
    return moment(endDate).diff(moment(startDate), 'months', true);
};

helper.getYearsDiff = function(endDate, startDate) {
    return moment(endDate).diff(moment(startDate), 'years', false);
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

helper.getRandomString = function(length){
    var result = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for(var i = 0; i < length; i++ ){
        result += possible.charAt(Math.floor(Math.random() * possible.length));
	 }
	 
    return result;
};

helper.syncLoop = function(iterations, process, exit) {
    var index = 0,
        done = false,
        shouldExit = false;
    var loop = {
        next:function() {
            if (done) {
                if (shouldExit && exit){
                    return exit(); // Exit if we're done
                }
            }
            // If we're not finished
            if (index < iterations) {
                index++; // Increment our index
                process(loop); // Run our process, pass in the loop
            // Otherwise we're done
            } else {
                done = true; // Make sure we say we're done
                if (exit) {
                    exit(); // Call the callback on exit
                }
            }
        },
        iteration:function() {
            return index - 1; // Return the loop number we're on
        },
        break:function(end) {
            done = true; // End the loop
            shouldExit = end; // Passing end as true means we still call the exit callback
        }
    };
    
    loop.next();
    return loop;
};

module.exports = helper;
