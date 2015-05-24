// partial of https://github.com/google/web-starter-kit/blob/master/gulpfile.js

'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')();
var del = require('del');
var reload = browserSync.reload;

var path = {};

path.srcDir = 'app';
path.distDir = '_dist';

gulp.task('css', ['clean:css'], function () {
  return gulp.src(path.srcDir + '/css/*.{styl,scss}')
    .pipe($.plumber())
    .pipe($.if('*.styl', $.stylus()))
    .pipe($.if('*.scss', $.sass()))
    .pipe($.postcss([
      require('autoprefixer')({browsers: ['last 1 version']})
    ]))
    .pipe(gulp.dest(path.distDir + '/css/'))
    .pipe($.filter('**/*.css'))
    .pipe(reload({stream:true}))
});

gulp.task('js', function () {
  return gulp.src(path.srcDir + '/js/*.src.js')
    .pipe($.plumber())
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')))
    .pipe($.babel())
    .pipe($.uglify())
    .pipe(gulp.dest(path.distDir + '/js/'))
});

gulp.task('html', function () {
  return gulp.src(path.srcDir + '/html/*.html')
    .pipe(gulp.dest(path.distDir + '/html/'))
    .pipe($.filter('**/*.js'))
    .pipe(reload({stream:true}))
});

gulp.task('clean', del.bind(null, [path.distDir]));
gulp.task('clean:css', del.bind(null, [path.distDir + '/css']));

// Watch Files For Changes & Reload
gulp.task('serve', ['default'], function () {
  browserSync({
    notify: false,
    server: path.distDir
  });

  // watch the folder to reload if files was change
  gulp.watch([path.srcDir + '/js/*.js'], ['js']);
  gulp.watch([path.srcDir + '/css/*.css'], ['css']);
  gulp.watch([path.srcDir + '/html/*.html'], ['html'], reload);
});

gulp.task('default', [], function () {
  gulp.start(['html', 'css', 'js']);
});
