const gulp = require('gulp'),
      concat = require('gulp-concat'),
      minifyCSS = require('gulp-minify-css'),
      autoprefixer = require('gulp-autoprefixer'),
      //rename = require('gulp-rename'),
      livereload = require('gulp-livereload'),
      //uglify = require('gulp-uglify'),
      babel = require('gulp-babel');


gulp.task('styles-index', () => {
    return gulp.src(['public/styles/reset.css', 
                     'public/styles/layout.css', 
                     'public/styles/authform.css'])
                .pipe(minifyCSS())
                .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
                .pipe(concat('index.min.css'))
                .pipe(gulp.dest('public/build/styles'))
                .pipe(livereload());
});

gulp.task('styles-dashboard', () => {
    return gulp.src(['public/styles/reset.css',
                     'public/styles/layout.css', 
                     'public/styles/dashboard.css', 
                     'public/styles/loader.css'])
                .pipe(minifyCSS())
                .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9'))
                .pipe(concat('dashboard.min.css'))
                .pipe(gulp.dest('public/build/styles'))
                .pipe(livereload());
});

gulp.task('styles', ['styles-index', 'styles-dashboard'], () => {
     
});

gulp.task('js-index', () => {
     return gulp.src(['public/js/index/background.js',
                      'public/js/index/login.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        //.pipe(uglify())
        .pipe(concat('index.js'))
        .pipe(gulp.dest('public/build/js'));
});

gulp.task('js-dashboard', () => {
    return gulp.src(['public/js/dashboard/dataProvider.js',
                     'public/js/dashboard/viewer.js',
                     'public/js/dashboard/eventer.js',
                     'public/js/dashboard/init.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        //.pipe(uglify())
        .pipe(concat('dashboard.js'))
        .pipe(gulp.dest('public/build/js'));
});



gulp.task('js', ['js-index', 'js-dashboard'], () => {
     
});

gulp.task('watch', () => {
    livereload.listen();
    gulp.watch('./public/styles/*.css', ['styles']);
    gulp.watch('./public/js/**/*.js', ['js']);
});

gulp.task('default', ['styles', 'js', 'watch']);
