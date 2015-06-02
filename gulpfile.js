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
    .pipe($.if('*.scss', $.sass({
      outputStyle: "expanded"
    })))
    .on('error', function (err) {
      $.util.log(err.message);
      this.emit('end');
    })
    .pipe($.postcss([
      require('autoprefixer')({browsers: ['last 1 version']})
    ]))
    .pipe(gulp.dest(path.distDir + '/css/'))
});

gulp.task('js', function () {
  return gulp.src(path.srcDir + '/js/*.src.js')
    .pipe($.plumber())
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.babel())
    .pipe($.uglify())
    .pipe($.rename(function (path) {
      path.basename = path.basename.replace('.src', '.min');
    }))
    .pipe(gulp.dest(path.distDir + '/js/'))
});

gulp.task('html', function () {
  return gulp.src(path.srcDir + '/html/*.{html,jade}')
    .pipe($.if('*.jade', $.jade()))
    .pipe(gulp.dest(path.distDir + '/html/'))
});

gulp.task('clean', del.bind(null, [path.distDir]));
gulp.task('clean:css', del.bind(null, [path.distDir + '/css']));

// Watch Files For Changes & Reload
gulp.task('serve', ['default'], function () {
  browserSync({
    browser: 'google-chrome',
    notify: false,
    server: path.distDir
  });

  // watch the folder to reload if files was change
  gulp.watch([path.srcDir + '/js/*.js'], ['js', reload]);
  gulp.watch([path.srcDir + '/css/*.{styl,scss}'], ['css', reload]);
  gulp.watch([path.srcDir + '/html/*.{html,jade}'], ['html', reload]);
});

gulp.task('default', ['clean'], function () {
  gulp.start(['html', 'css', 'js']);
});
