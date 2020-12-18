var gulp = require('gulp'),
	babel = require('gulp-babel'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglifyjs'),
	cssnano = require('gulp-cssnano'),
	rename = require('gulp-rename'),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	cache = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer'),
	gcmq = require('gulp-group-css-media-queries'),
	fileinclude = require('gulp-file-include'),
	pug = require('gulp-pug');

gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.+(scss|sass)')
		.pipe(sass())
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts', function() {
	return gulp.src([
		// './node_modules/jquery/dist/jquery.min.js',
	])
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task('clean', function() {
	return del.sync('dist');
});

gulp.task('clean-html', function() {
	return del.sync('app/*.html');
});

gulp.task('clear', function() {
	return cache.clearAll();
});

gulp.task('img', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin()))
	.pipe(gulp.dest('dist/img'));
});

gulp.task('file-include', function() {
	gulp.src(['app/1_html/pages/*.html'])
	.pipe(fileinclude({
		prefix: '@@',
		basepath: 'app/html'
	}))
	.pipe(gulp.dest('app/'));
});

gulp.task('pug', function(){
	return gulp.src('app/_pug/pages/*.pug')
	.pipe(pug({
		pretty:true
	}))
	.pipe(gulp.dest('app/'));
});

gulp.task('watch-with-pug', ['browser-sync', 'clean-html', 'pug'], function() {
	gulp.watch('app/sass/**/*.+(scss|sass)', ['sass']);
	gulp.watch('app/_pug/**/*.pug', ['clean-html', 'pug']);
	gulp.watch('app/_pug/**/*.pug', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});


gulp.task('build', ['clean', 'sass', 'scripts'], function() {
	var buildLibs = gulp.src([
			'app/css/libs.min.css'
		])
		.pipe(gulp.dest('dist/css'));

	var buildCss = gulp.src([
			'app/css/main.css'
		])
		.pipe(gcmq())
		.pipe(gulp.dest('dist/css'));

	var buildMinCss = gulp.src([
			'dist/css/main.css'
		])
		.pipe(cssnano())
		.pipe(rename({suffix: '.min'}));

	var buildJs = gulp.src('app/js/**/*')
		.pipe(gulp.dest('dist/js'));

	var buildHtml = gulp.src('app/*.html')
		.pipe(gulp.dest('dist'));

	var buildImage = gulp.src('app/static/**/*')
    .pipe(gulp.dest('dist/static'));
});

gulp.task('default', ['watch-with-pug']); // Choose gulp assembly
