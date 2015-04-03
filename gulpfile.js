var gulp = require('gulp');
var browserify = require('browserify');
var jadeify = require("jadeify");
var source = require('vinyl-source-stream');
var streamify = require('gulp-streamify');
var watchify = require('watchify');
var sass = require('gulp-sass');
var jsFile = './app/app.js';

var scriptCompile = function() {
	var bundle = watchify(browserify(jsFile, {
	    extensions: ['.js']
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
	     .pipe(source('app.js'))

	 stream.pipe(gulp.dest('./public/'))
	     .on('end', function(e) {
	     	console.log('Compiled');
	     })
}

gulp.task('js', function() {
	scriptCompile();
});

 
gulp.task('sass', function () {
    gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'));
});



gulp.task('default', ['js'])