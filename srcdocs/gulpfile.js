/*!
 * gulp
 * $ npm install gulp-ruby-sass gulp-autoprefixer gulp-cssnano gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache del --save-dev
 */
// Load plugins
var gulp = require('gulp'), // gulp main module
    sass = require('gulp-sass'), // compiles sass
    sourcemaps = require('gulp-sourcemaps'); // creates source maps
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
    ttf2woff = require('gulp-ttf2woff'), // converts fonts from TTF to woff

    // Paths
    pathToStyles = 'styles/',
    pathToScritps = 'scripts/',
    pathToImages = 'images/',
    pathToFonts = '../fonts/Monoto-VF-TTF/',
    pathToDocs = '../docs/';

// TODO: Error handling

// Styles
gulp.task('styles', function() {
    gulp.src( pathToStyles + 'main.scss' )
        .pipe(
            sass( {
                errLogToConsole: true,
                outputStyle: 'compressed',
                precision: 10
            })
            .on("error", notify.onError(function (error) {
                return "Error spotted! " + error.message;
            }))
        )
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest(pathToDocs + 'styles'))
        .pipe(rename({ 
            suffix: '.min' 
        }))
        .pipe(cssnano())
        .pipe(sourcemaps.write('./', { 
            includeContent: false, 
            sourceRoot: 'source' 
        }))
        .pipe( sourcemaps.init({ 
            loadMaps: true 
        }))
        .pipe(gulp.dest(pathToDocs + 'styles'));
});

// Scripts
gulp.task('scripts', function() {
    return gulp.src(pathToScritps + '**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(pathToDocs + 'scripts'))
        .pipe(rename({ 
            suffix: '.min' 
        }))
        .pipe(uglify()
            .on('error', notify.onError(function (error) {
                return 'Error spotted! ' + error.message;
            })))
        .pipe(gulp.dest(pathToDocs + 'scripts'));
});

// Images
gulp.task('images', function() {
    return gulp.src(pathToImages + '/**/*')
        .pipe(cache(imagemin({ 
            optimizationLevel: 3, 
            progressive: true, 
            interlaced: true 
        })))
        .pipe(gulp.dest(pathToDocs + 'images'));
});

// Fonts: TTF to woff
gulp.task('ttfToWoff', ['clean-fonts'], function() {
    gulp.src(pathToFonts + '*.ttf')
    .pipe(ttf2woff())
    .pipe(gulp.dest(pathToDocs + 'fonts/'));
});

// Clean build
gulp.task('clean', function() {
return del(
    [
        pathToDocs + 'styles', 
        pathToDocs + 'scripts', 
        pathToDocs + 'images'
    ],
    {
        force: true
    });
});

// Clean fonts
gulp.task('clean-fonts', function() {
return del(
    [
        pathToDocs + 'fonts'
    ], 
    {
        force: true
    });
});

// Clean sourcemaps
gulp.task('clean-sourcemaps', function() {
return del(
    [
        pathToDocs + 'styles/*.map'
    ], 
    {
        force: true
    });
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});

// Production
// TODO: refactor for Gulp 4.0, make `clean-sourcemaps` async
gulp.task('production', function() {
    gulp.start('default', 'ttfToWoff', 'clean-sourcemaps');
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