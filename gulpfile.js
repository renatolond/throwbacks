var gulp = require('gulp');
var browserify = require('browserify');
var jadeify = require("jadeify");
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var watchify = require('watchify');
var sass = require('gulp-sass');
var jsFile = './app/index.js';
var concat = require('gulp-concat');

var scriptCompile = function() {
	var bundle = watchify(browserify(jsFile, {
	    extensions: ['.js', '.jade']
	  , debug: true
	    // Required for watchify
	  , cache: {}
	  , packageCache: {}
	  , fullPaths: true
	}))
	.transform(jadeify)
	.on('update', function() {
	    scriptCompile();
	});

	var stream = bundle.bundle()
	     .on('error', function(e){
	     	console.error('Error: ', e);
	     })
	     .pipe(source('index.js'))

	 stream.pipe(gulp.dest('./public/'))
	     .on('end', function(e) {
	     	console.log('Compiled');
	     });
}

var styleCompile = function() {
	gulp.src('./app/scss/throwback.scss')
	   .pipe(sass())
	   .pipe(concat('app.css'))
	   .pipe(gulp.dest('./public'))
}

gulp.task('js', function() {
	scriptCompile();
});

 
gulp.task('sass', function () {
	styleCompile();
});


gulp.task('watch', function() {
  gulp.watch('./app/scss/**/*.scss', ['sass'], function() {
  	console.log('Sass changed')
  });
  // gulp.watch('./app/**/*.js', ['js']);
});


gulp.task('default', ['watch', 'sass', 'js'])