'use strict';

var gulp = require('gulp');

/**
 * Run server.
 */

gulp.task('server', ['build'], function () {
  if (process.env.NODE_ENV === 'development') {
    var livereload = require('gulp-livereload');
    livereload.listen();

    require('gulp-nodemon')({
      script: 'server',
      watch: [
        'package.json',
        'config/config.json',
        'config/config.' + process.env.NODE_ENV + '.json',
        'server/**/*.js'
      ],
      ignore: [
        'test/**'
      ]
    }).on('restart', livereload.changed);

    gulp.watch([
      'client/app/**/*.js',
      'client/app/**/*.html'
    ], ['browserify']);

    gulp.watch([
      'client/assets/sass/**/*.scss'
    ], ['compass']);

    gulp.watch([
      'dist/**/*',
      'server/**/*.ejs'
    ]).on('change', livereload.changed);
  } else {
    require('./server');
  }
});

/**
 * Build application.
 */

gulp.task('build', ['browserify', 'images', 'compass', 'material.css', 'material.themes.css', 'icons']);

/**
 * Browserify client files.
 */

gulp.task('browserify', function () {
  return gulp.src('client/app/index.js')
  .pipe(require('gulp-browserify')({
    transform: [
      require('html2js-browserify')
    ],
    shim: {
      'lodash': {
        path: 'node_modules/lodash/lodash.js',
        exports: '_'
      },
      'angular': {
        path: 'client/components/angular/angular.js',
        exports: 'angular'
      },
      'angular-animate': {
        path: 'client/components/angular-animate/angular-animate.js',
        exports: 'angular.module("ngAnimate")',
        depends: {
          angular: 'angular'
        }
      },
      'angular-aria': {
        path: 'client/components/angular-aria/angular-aria.js',
        exports: 'angular.module("ngAria")',
        depends: {
          angular: 'angular'
        }
      },
      'hammerjs': {
        path: 'client/components/hammerjs/hammer.js',
        exports: 'Hammer'
      },
      'angular-material': {
        path: 'client/components/angular-material/angular-material.js',
        exports: 'angular.module("ngMaterial")',
        depends: {
          angular: 'angular',
          hammerjs: 'Hammer'
        }
      },
      'ui-router': {
        path: 'client/components/ui-router/release/angular-ui-router.js',
        exports: 'angular.module("ui.router")',
        depends: {
          angular: 'angular'
        }
      }
    }
  }))
  .pipe(require('gulp-concat')('main-app.js'))
  .pipe(gulp.dest('dist/js'));
});

/**
 * Copy images
 */

gulp.task('images', function () {
  return gulp.src('client/assets/images/**')
  .pipe(gulp.dest('dist/images'));
});

/**
 * Compile sass files.
 */

gulp.task('compass', function () {
  return gulp.src('client/assets/sass/main.scss')
  .pipe(require('gulp-compass')({
    project: __dirname,
    css: 'dist/css',
    sass: 'client/assets/sass'
  }))
  .pipe(gulp.dest('dist/css'));
});

/**
 * Copy angular-material css file
 */

gulp.task('material.css', function () {
  return gulp.src('client/components/angular-material/angular-material.css')
  .pipe(gulp.dest('dist/css'));
});

/**
 * Copy angular-material themes css file
 */

gulp.task('material.themes.css', function () {
  return gulp.src('client/components/angular-material/themes/*.css')
  .pipe(gulp.dest('dist/css/themes'));
});

/**
 * Copy material design icons
 */

gulp.task('icons', function () {
  return gulp.src('client/components/material-design-icons/*/svg/design/*')
  .pipe(gulp.dest('dist/images/icons'));
});

/**
 * Lint JS files.
 */

gulp.task('lint', function() {
  var jshint = require('gulp-jshint');

  return gulp.src([
    './gulpfile.js',
    './server/**/*.js',
    './test/**/*.js'
  ])
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'))
  .pipe(jshint.reporter('fail'));
});

/**
 * Run tests.
 */

gulp.task('test', function (done) {
  require('run-sequence')('test:client', 'test:server', done);
});

gulp.task('test:server', function () {
  return gulp.src('test/server/**/*.js').pipe(require('gulp-mocha')({ reporter: 'spec' }));
});

gulp.task('test:server:watch', function () {
  return gulp.watch([
    'server/**/*.js',
    'test/server/**/*.js'
  ], ['test:server']);
});

gulp.task('test:client', ['build'], function () {
  return gulp.src([
    'dist/js/*.js',
    'client/components/angular-mocks/angular-mocks.js',
    'test/client/**/*.js'
  ])
  .pipe(require('gulp-karma')({
    configFile: 'test/client/karma.conf.js',
    action: 'run'
  }));
});

gulp.task('test:client:watch', function () {
  gulp.src([
    'dist/js/*.js',
    'client/components/angular-mocks/angular-mocks.js',
    'test/client/**/*.js'
  ])
  .pipe(require('gulp-karma')({
    configFile: 'test/client/karma.conf.js',
    action: 'watch'
  }));
});

/**
 * Bump version.
 */

gulp.task('bump:major', function(){
  gulp.src(['./package.json', './bower.json'])
  .pipe(require('gulp-bump')({type:'major'}))
  .pipe(gulp.dest('./'));
});

gulp.task('bump:minor', function(){
  gulp.src(['./package.json', './bower.json'])
  .pipe(require('gulp-bump')({type:'minor'}))
  .pipe(gulp.dest('./'));
});

gulp.task('bump:patch', function(){
  gulp.src(['./package.json', './bower.json'])
  .pipe(require('gulp-bump')({type:'patch'}))
  .pipe(gulp.dest('./'));
});
