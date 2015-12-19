const gulp = require('gulp'),
      concat = require('gulp-concat'),
      minifyCSS = require('gulp-minify-css'),
      autoprefixer = require('gulp-autoprefixer'),
      rename = require('gulp-rename'),
      livereload = require('gulp-livereload'),
      babel = require('gulp-babel'),
      uglify = require('gulp-uglify');


gulp.task('styles', () => {
    return gulp.src(['public/styles/reset.css', 'public/styles/**/*.css'])
                .pipe(minifyCSS())
                .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
                .pipe(concat('all.min.css'))
                .pipe(gulp.dest('public/build/styles'))
                .pipe(livereload());
});

gulp.task('js-bg', () => {
    return gulp.src(['public/js/index/background.js'])
                .pipe(uglify())
                .pipe(rename('bg.min.js'))
                .pipe(gulp.dest('public/build/js/index'));
});

gulp.task('js-index', ['js-bg'], () => {
     return gulp.src(['public/js/index/login.js'])
                .pipe(babel({
                    presets: ['es2015']
                }))
                .pipe(uglify())
                .pipe(gulp.dest('public/build/js/index'));
});


gulp.task('js', ['js-index'], () => {
     
});

gulp.task('watch', () => {
    livereload.listen();
    gulp.watch('./public/styles/*.css', ['styles']);
    gulp.watch('./public/js/**/*.js', ['js-index']);
});

gulp.task('default', ['styles', 'js', 'watch']);
