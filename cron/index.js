'use strict';

var croneMode = process.env.NODE_ENV_CRONMODE || 'test',
    config = require('config'),
    cronTimes,
    fs = require('fs'),
    path = require('path'),
    jobs = [],
    jobsFolder = path.join(__dirname, 'jobs');

if (croneMode === 'standard') {
    cronTimes = config.cron.times;
} else {
    //1 day = 1 second
    cronTimes = config.testcron.times;
}

fs
    .readdirSync(jobsFolder)
    .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach(function(file) {
        jobs.push( 
            require( path.join(jobsFolder, file) )( cronTimes[ file.slice(0, -3) ] )
        );
    });


module.exports = {
    startJobs: function() {
        jobs.forEach(function(job) {
            job.start();
        });
    },
    stopJobs: function() {
        jobs.forEach(function(job) {
            job.stop();
        });
    }
};
