/**
 * Gulpfile for Startwheel project. Uses browserify for 
 * Node.js style dependencies, and watchify for live
 * code change tracking.
 *
 * @author juanvallejo
 * @date 6/15/15
 */

var browserify  = require('browserify');
var browserSync = require('browser-sync');
var gulp        = require('gulp');
var gutil       = require('gulp-util');
var http        = require('http');
var reload      = browserSync.reload;
var sass        = require('gulp-sass');
var source      = require('vinyl-source-stream');
var watchify    = require('watchify');

/**
 * Build production assets and serve local dev server
 */
gulp.task('default', ['html', 'css'], function() {

    // configure browsersync
    browserSync({
        notify: false,
        port: 9000,
        server: {
            target: '0.0.0.0',
            baseDir: __dirname
        }
    });

	var bundle = browserify({
		cache: {},
		detectGlobals: false,
		debug: true,
		entries: ['./js/main.js'],
		fast: true,
		extensions: ['.js', '.jsx'],
		packageCache: {},
		fullPaths: true
	});

	bundle = watchify(bundle);

	bundle.on('update', function() {
		exportBundle(bundle);
	});

	return exportBundle(bundle);

});

gulp.task('css', function() {

    gulp
        .watch('./css/main.css')
        .on('change', function() {
            
            console.log('static> Exporting static css assets...');

            gulp
                .src('./css/main.css')
                .pipe(sass())
                .pipe(gulp.dest('./dist'));

            reload();

        });

});

/**
 * Run parser tasks on static assets, build into production file
 * and watch for changes
 */
gulp.task('html', function() {

    gulp
        .watch('index.html')
        .on('change', function() {

            console.log('static> Exporting static html assets...');
            reload();

        });

});

/**
 * Build and package products and assets into production
 * bundle / distribution folder
 */
function exportBundle(bundle) {

	console.log('Watchify> Exporting bundle...');

    // watch changes to html

	bundle
		.bundle()
		.on('error', function(error) {
			gutil.log('bundle> ' + error.toString());
			gutil.beep();
		})
		.pipe(source('startwheel.js'))
		.pipe(gulp.dest('./dist'))
        .pipe(reload({ stream: true }));

}