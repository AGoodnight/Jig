 var gulp = require('gulp'),
    sass = require('gulp-sass'),
    livereload = require('gulp-livereload'),
    watch = require('gulp-watch');
    var plumber = require('gulp-plumber');

gulp.task('sass', function() {
   gulp.src('scss/*.scss')
   .pipe(plumber())
   .pipe(sass())
   .pipe(gulp.dest('css'))
   .pipe(livereload())
   .pipe(plumber.stop());
});

gulp.task('watch', function() {
	gulp.watch('scss/*.scss', ["sass"]);
});

// Default Task
gulp.task('default', ['sass', 'watch']);