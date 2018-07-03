const gulp = require('gulp'),
  pug = require('gulp-pug'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync').create();

/* ### Methods ### */

/* Tasks to do */
gulp.task('pug', () =>
  gulp.src('./dev/views/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('./dist'))
);

gulp.task('sass', () =>

  /* Origin folder(s) - Pickup the file or files (array) */
  gulp.src('./dev/sass/*.sass')
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({
      versions: ['last 2 browsers']
    }))

    /* Destiny folder(s) - Drop the file or files (array) */
    .pipe(gulp.dest('./dist/css'))
);

gulp.task('default', () => {

  browserSync.init({
    server: './dist/'
  });

  /* Watch files for changes to compile */
  gulp.watch('./*.html').on('change', browserSync.reload);
  gulp.watch('./*.css').on('change', browserSync.reload);
  gulp.watch('./*.js').on('change', browserSync.reload);
  gulp.watch('./dev/views/**/*.pug', gulp.series('pug'));
  gulp.watch('./dev/sass/*.sass', gulp.series('sass'));

});
