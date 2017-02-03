/*!
 * gulp
 * $ npm install gulp-ruby-sass gulp-autoprefixer gulp-cssnano gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 */
// Load plugins
var gulp = require('gulp'), // gulp main module
    sass = require('gulp-ruby-sass'), // compiles sass
    autoprefixer = require('gulp-autoprefixer'), // adds prefixes to CSS
    cssnano = require('gulp-cssnano'), // minifies CSS
    jshint = require('gulp-jshint'), // checkes JS code
    uglify = require('gulp-uglify'), // minifies JS
    imagemin = require('gulp-imagemin'), // compresses images
    rename = require('gulp-rename'), // renames temp CSS and JS files
    concat = require('gulp-concat'), // adds files and creates one huge file either CSS or JS
    notify = require('gulp-notify'), // notifies on results
    cache = require('gulp-cache'), // cache proxy
    livereload = require('gulp-livereload'), // livereload
    del = require('del'), // deletes files

    pathToStyles = 'styles/',
    pathToScritps = 'scripts/',
    pathToImages = 'images/',
    pathToDocs = '../docs/';

// Styles
gulp.task('styles', function() {
    return sass(pathToStyles + 'main.scss', { style: 'expanded' })
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest(pathToDocs + 'styles'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano())
        .pipe(gulp.dest(pathToDocs + 'styles'))
        .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('scripts', function() {
    return gulp.src(pathToScritps + '**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(pathToDocs + 'scripts'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest(pathToDocs + 'scripts'))
        .pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('images', function() {
    return gulp.src(pathToImages + '/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
        .pipe(gulp.dest(pathToDocs + 'images'))
        .pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function() {
return del(
    [pathToDocs + 'styles', pathToDocs + 'scripts', pathToDocs + 'images'],
    {force: true});
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});

// Watch
gulp.task('watch', function() {
    // Watch .scss files
    gulp.watch(pathToStyles + '/**/*.scss', ['styles']);
    // Watch .js files
    gulp.watch(pathToScritps + '/**/*.js', ['scripts']);
    // Watch image files
    gulp.watch(pathToImages + '/**/*', ['images']);
    // Create LiveReload server
    livereload.listen();
    // Watch any files in dist/, reload on change
    gulp.watch([pathToDocs + '**']).on('change', livereload.changed);
});