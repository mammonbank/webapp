var gulp = require('gulp');

gulp.task('clientAssets', function() {
    gulp.src('./client/public/**/')
        .pipe(gulp.dest('/var/www/mammonbank.tk/public'));
});

gulp.task('watch', function() {
    gulp.watch('./client/public/**/*', ['clientAssets']);
});

gulp.task('default', ['clientAssets', 'watch']);
