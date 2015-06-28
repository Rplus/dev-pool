// partial of https://github.com/google/web-starter-kit/blob/master/gulpfile.js

'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')();
var del = require('del');
var reload = browserSync.reload;

var path = {};

// if you want to generate special css,
// just run `gulp serve --p #{$projectName}`
// this use in 'css' task now. it will speedup compile speed
var projectName = '*';

path.srcDir = 'app';
path.distDir = '_dist';

gulp.task('css', function () {
  return gulp.src(path.srcDir + '/css/' + projectName + '.{styl,scss}')
    .pipe($.plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe($.if('*.styl', $.stylus()))
    .pipe($.if('*.scss', $.sass({
      outputStyle: "expanded"
    })))
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
    .pipe($.plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe($.if('*.jade', $.jade()))
    .pipe(gulp.dest(path.distDir + '/html/'))
});

gulp.task('clean', del.bind(null, [path.distDir]));
gulp.task('clean:css', del.bind(null, [path.distDir + '/css']));

gulp.task('serve', ['default'], function () {
  browserSync({
    browser: 'google-chrome',
    notify: false,
    ghostMode: {
      clicks: false,
      scroll: false,
      forms: false
    },
    scrollThrottle: 500,
    startPath: ($.util.env.p ? '_dist/html/' + $.util.env.p + '.html' : null),
    server: ''
  });
});

// Watch Files For Changes & Reload
gulp.task('dev', ['serve'], function () {
  projectName = $.util.env.p ? $.util.env.p : '*';
  // watch the folder to reload if files was change
  gulp.watch([path.srcDir + '/js/*.js'], ['js', reload]);
  gulp.watch([path.srcDir + '/css/*.{styl,scss}'], ['css', reload]);
  gulp.watch([path.srcDir + '/html/*.{html,jade}'], ['html', reload]);
});

// deploy dist folder to github branch gh-pages
gulp.task('deploy', function() {
  var name = $.util.env.p ? $.util.env.p : '**';
  return gulp.src(path.distDir + '/' + name + '/*')
    .pipe($.ghPages());
});

gulp.task('default', ['clean'], function () {
  gulp.start(['html', 'css', 'js']);
});
