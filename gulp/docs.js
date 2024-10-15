const gulp = require("gulp");
// HTML
const fileInclude = require("gulp-file-include");
const htmlclean = require("gulp-htmlclean");
const webpHTML = require("gulp-webp-html");
// SCSS
const sass = require("gulp-sass")(require("sass"));
const sassGlob = require("gulp-sass-glob");
const server = require("gulp-server-livereload");
const sourceMaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const csso = require("gulp-csso");
const groupMedia = require("gulp-group-css-media-queries");

const clean = require("gulp-clean");
const fileSystem = require("fs");

const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const { title } = require("process");

const webpack = require("webpack-stream");

const babel = require("gulp-babel");
// IMG
const imagemin = require("gulp-imagemin");
const avif = require("gulp-avif");
const webp = require("gulp-webp");

const changed = require("gulp-changed");

const plumberNotify = (title) => {
  return {
    errorHandler: notify.onError({
      title: title,
      massage: "Error <%= error.message %>",
    }),
  };
};

gulp.task("html:docs", function () {
  return (
    gulp
      .src(["./build/*.html", "!./build/blocks/*.html"])
      .pipe(changed("./docs/"))
      .pipe(plumber(plumberNotify("HTML")))
      // .pipe(
      //   fileInclude({
      //     prefix: "@",
      //     basepath: "@file",
      //   })
      // )
      // .pipe(webpHTML())

      .pipe(htmlclean())

      .pipe(gulp.dest("./docs/"))
  );
});

gulp.task("sass:docs", function () {
  return gulp
    .src("./src/scss/*.scss")
    .pipe(changed("./docs/css/"))
    .pipe(plumber(plumberNotify("Styles")))
    .pipe(sourceMaps.init())
    .pipe(autoprefixer())
    .pipe(sassGlob())
    .pipe(groupMedia())
    .pipe(sass())
    .pipe(csso())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest("./docs/css"));
  // .pipe(browserSync.stream());
});

gulp.task("images:docs", function () {
  return (
    gulp
      .src("./build/img/**/*", { encoding: false })
      // .pipe(changed("./docs/img"))
      // .pipe(webp())
      // .pipe(gulp.dest("./docs/img"))

      // .pipe(gulp.src("./src/img/**/*", { encoding: false }))
      // .pipe(changed("./docs/img"))
      // .pipe(imagemin({ verbose: true }))
      .pipe(gulp.dest("./docs/img"))
  );
});

gulp.task("fonts:docs", function () {
  return gulp
    .src("./src/fonts/**/*")
    .pipe(changed("./docs/fonts/"))
    .pipe(gulp.dest("./docs/fonts/"));
});

gulp.task("files:docs", function () {
  return gulp
    .src("./src/files/**/*")
    .pipe(changed("./docs/files/"))
    .pipe(gulp.dest("./docs/files/"));
});

gulp.task("js:docs", function () {
  return gulp
    .src("./src/js/*.js")
    .pipe(changed("./docs/js/"))
    .pipe(plumber(plumberNotify("JS")))
    .pipe(babel())
    .pipe(webpack(require("../webpack.config.js")))
    .pipe(gulp.dest("./docs/js/"));
});

gulp.task("server:docs", function () {
  return gulp.src("./docs/").pipe(
    server({
      livereload: true,
      // directoryListing: true,
      open: true,
    })
  );
});

gulp.task("clean:docs", function (done) {
  if (fileSystem.existsSync("./docs/")) {
    return gulp
      .src("./docs/", { read: false, allowEmpty: true })
      .pipe(clean({ force: true }));
  }
  done();
});
