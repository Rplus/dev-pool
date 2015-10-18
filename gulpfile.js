// partial of https://github.com/google/web-starter-kit/blob/master/gulpfile.js

'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')();
var del = require('del');
var reload = browserSync.reload;

var appPath = {
  srcDir: 'app/',
  distDir: '_dist/'
};

// if you want to generate special css,
// just run `gulp serve --p #{$projectName}`
// this use in 'css' task now. it will speedup compile speed
var projectName = '**/';

gulp.task('css', function () {
  return gulp.src(appPath.srcDir + projectName + '*.{styl,scss}', {base: appPath.srcDir})
    .pipe($.plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe($.sourcemaps.init())
    .pipe($.if('*.styl', $.stylus()))
    .pipe($.if('*.scss', $.sass({
      outputStyle: "expanded"
    })))
    .pipe($.postcss([
      require('autoprefixer')({browsers: ['last 1 version']})
    ]))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(appPath.distDir))
});

gulp.task('js', function () {
  return gulp.src(appPath.srcDir + projectName + '*.js', {base: appPath.srcDir})
    .pipe($.plumber())
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.uglify())
    .pipe($.rename(function (path) {
      path.basename = path.basename.replace('.src', '.min');
    }))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(appPath.distDir))
});

gulp.task('html', function () {
  return gulp.src(appPath.srcDir + projectName + '*.{html,jade}', {base: appPath.srcDir})
    .pipe($.plumber({
        errorHandler: function (err) {
            console.log(err);
            this.emit('end');
        }
    }))
    .pipe($.if('*.jade', $.jade({
      pretty: true
    })))
    .pipe(gulp.dest(appPath.distDir))
});

gulp.task('clean', del.bind(null, [appPath.distDir]));

gulp.task('clean:css', function() {
  del([appPath.distDir + '**/*.css', appPath.distDir + 'css'])
});

gulp.task('serve', function () {
  browserSync({
    open: 'external',
    browser: 'google-chrome',
    notify: false,
    ghostMode: {
      clicks: false,
      scroll: false,
      forms: false
    },
    scrollThrottle: 500,
    startPath: ($.util.env.p ? appPath.distDir + $.util.env.p : null),
    server: ''
  });
});

// Watch Files For Changes & Reload
gulp.task('dev', ['serve'], function () {
  projectName = $.util.env.p ? $.util.env.p + '/' : projectName;

  // watch the folder to reload if files was change
  gulp.watch([appPath.srcDir + projectName + '*.js'], ['js', reload]);
  gulp.watch([appPath.srcDir + projectName + '*.{styl,scss}'], ['css', reload]);
  gulp.watch([appPath.srcDir + projectName + '*.{html,jade}'], ['html', reload]);
});

// deploy dist folder to github branch gh-pages
gulp.task('deploy', function() {
  var name = $.util.env.p ? $.util.env.p : '**';
  return gulp.src(appPath.distDir + name + '/*')
    .pipe($.ghPages());
});

gulp.task('default', ['clean'], function () {
  gulp.start(['html', 'css', 'js']);
});
