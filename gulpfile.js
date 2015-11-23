'use strict';

var gulp         = require('gulp');
var gutil        = require("gulp-util");
var htmlmin      = require('gulp-htmlmin');
var compass      = require("gulp-compass");
var postcss      = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var babel        = require('gulp-babel');
var concat       = require("gulp-concat");
var uglify       = require("gulp-uglify");
var browserify   = require("gulp-browserify");
var imagemin     = require("gulp-imagemin");
var pngquant     = require("imagemin-pngquant");
var browserSync  = require('browser-sync').create();

var path = {
	DOMEN:               "store.pro",
	HTML_SOURCES:        "assets/views/**/*.html",
	HTML_DESTINATION:    "app/views/",
	STYLES_SOURCES:      "assets/scss/**/*.scss",
	STYLES_DESTINATION:  "public/styles/",
	ES2015_SOURCES:      "assets/ES2015/**/*.js",
	ES2015_DESTINATION:  "assets/scripts/",
	SCRIPTS_SOURCES:     "assets/scripts/**/*.js",
	SCRIPTS_DESTINATION: "public/scripts/",
	SCRIPTS_CONCAT: [
		"main.js"
	],
	IMAGES_SOURCES:      "assets/images/**/*.*",
	IMAGES_DESTINATION:  "public/images/",
	WATCH_BROWSER_SYNC: [
		"public/**/*.*", "app/**/*.*"
	]
}

gulp.task('default', [
	"html",
	"styles",
	"ES2015",
	"scripts",
	"images",
	"watch",
	"browser-sync"
]);

gulp.task('watch', function() {
	gulp.watch(path.HTML_SOURCES,      ['html']);
	gulp.watch(path.STYLES_SOURCES,    ['styles']);
	gulp.watch(path.ES2015_SOURCES,    ['ES2015']);
	gulp.watch(path.SCRIPTS_SOURCES,   ['scripts']);
	gulp.watch(path.IMAGES_SOURCES,    ['images']);
});

gulp.task('browser-sync', function() {
	browserSync.init({
		proxy: path.DOMEN
	});
	gulp.watch(path.WATCH_BROWSER_SYNC).on('change', browserSync.reload);
});

gulp.task('html', function() {
	gulp.src(path.HTML_SOURCES)
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
			.on('error', gutil.log)
		.pipe(gulp.dest(path.HTML_DESTINATION));
});

gulp.task('styles', function() {
	gulp.src(path.STYLES_SOURCES)
		.pipe(compass({
			sass:  'assets/scss',
			css:   'public/styles',
			image: 'public/images',
			style: 'compressed'
		}))
		.pipe(postcss([ autoprefixer({ 
			browsers: ['last 2 versions'] 
		}) ]))
			.on('error', gutil.log)
		.pipe(gulp.dest(path.STYLES_DESTINATION));
});

gulp.task('ES2015', function() {
	gulp.src(path.ES2015_SOURCES)
		.pipe(babel({
			presets: ['es2015']
		}))
			.on('error', gutil.log)
		.pipe(gulp.dest(path.ES2015_DESTINATION));
});

gulp.task('scripts', function() {
	gulp.src(path.SCRIPTS_SOURCES)
		.pipe(concat('main.js'))
		.pipe(browserify())
		.pipe(uglify())
			.on('error', gutil.log)
		.pipe(gulp.dest(path.SCRIPTS_DESTINATION));
});

gulp.task('images', function() {
	gulp.src(path.IMAGES_SOURCES)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{
				removeViewBox: false
			}],
			use: [pngquant()]
		}))
			.on('error', gutil.log)
		.pipe(gulp.dest(path.IMAGES_DESTINATION));
});