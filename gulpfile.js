'use strict';

var gulp = require('gulp');

gulp.task('clientAssets', function() {
    gulp.src('./client/public/**/')
        .pipe(gulp.dest('/var/www/mammonbank.tk/public'));
});

gulp.task('bankAssets', function() {
    gulp.src('./bank/public/**/')
        .pipe(gulp.dest('/var/www/admin-mammonbank.tk/public'));
});

gulp.task('default', ['clientAssets', 'bankAssets']);

