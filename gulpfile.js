'use strict';

var gulp = require('gulp'),
    concat = require('gulp-concat');

gulp.task('clientAssets', function() {
    gulp.src('./client/public/**/')
        .pipe(gulp.dest('/var/www/mammonbank.tk/public'));
});

gulp.task('watch', function() {
    gulp.watch('./client/public/**/*', ['clientAssets']);
});

gulp.task('js', function() {
    gulp.src('./client/js/**/*.js')
        //.pipe(concat('_bank.js'))
        .pipe(gulp.dest('./client/public/js'));

});

gulp.task('dev', function() {
    gulp.watch('./client/js/**/*.js', ['js']);
});

gulp.task('default', ['clientAssets', 'watch']);
