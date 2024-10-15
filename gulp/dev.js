const gulp = require("gulp");
// HTML
const fileInclude = require("gulp-file-include");
const avifWebpHtml = require("gulp-avif-webp-retina-html");
// SCSS
const sass = require("gulp-sass")(require("sass"));
const sassGlob = require("gulp-sass-glob");
const server = require("gulp-server-livereload");
const sourceMaps = require("gulp-sourcemaps");

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

gulp.task("html:dev", function () {
  return gulp
    .src(["./src/html/**/*.html", "!./src/html/blocks/*.html"])
    .pipe(changed("./build/", { hasChanged: changed.compareContents }))
    .pipe(plumber(plumberNotify("HTML")))
    .pipe(
      fileInclude({
        prefix: "@",
        basepath: "@file",
      })
    )
    .pipe(
      avifWebpHtml({
        extensions: ["avif", "webp", "jpg"],
        retina: {
          1: "",
          // 1: "@1x",
          // 2: "@2x",
          // 3: "@3x",
          // 4: "@4x",
        },
        // checkExists: true,
        noAvif: false,
        noWebp: false,
        // publicPath: "img/",
        publicPath: "./build/img/**/",
      })
    )
    .pipe(gulp.dest("./build/"));
  // .pipe(browserSync.stream());
});

gulp.task("sass:dev", function () {
  return gulp
    .src("./src/scss/*.scss")
    .pipe(changed("./build/css/"))
    .pipe(plumber(plumberNotify("Styles")))
    .pipe(sourceMaps.init())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest("./build/css"));
  // .pipe(browserSync.stream());
});

gulp.task("images:dev", function () {
  return (
    gulp
      .src("./src/img/**/*.*", { encoding: false })
      .pipe(changed("./build/img/"))
      // .pipe(avif())
      // .pipe(gulp.dest("./build/img"))

      // // .pipe(gulp.src("./src/img/**/*", { encoding: false }))
      // .pipe(changed("./build/img"))
      .pipe(webp())
      .pipe(gulp.dest("./build/img/"))

      .pipe(gulp.src("./src/img/**/*", { encoding: false }))
      .pipe(changed("./build/img/"))
      .pipe(imagemin({ verbose: true }))
      .pipe(gulp.dest("./build/img/"))
  );
});

gulp.task("avif:dev", function () {
  return gulp
    .src("./src/img/**/*.*", { encoding: false })
    .pipe(changed("./build/img/"))
    .pipe(avif())
    .pipe(gulp.dest("./build/img/"));
});

gulp.task("fonts:dev", function () {
  return gulp
    .src("./src/fonts/**/*")
    .pipe(changed("./build/fonts/"))
    .pipe(gulp.dest("./build/fonts/"));
});

gulp.task("files:dev", function () {
  return gulp
    .src("./src/files/**/*")
    .pipe(changed("./build/files/"))
    .pipe(gulp.dest("./build/files/"));
});

gulp.task("js:dev", function () {
  return (
    gulp
      .src("./src/js/*.js")
      .pipe(changed("./build/js/"))
      .pipe(plumber(plumberNotify("JS")))
      // .pipe(babel())
      .pipe(webpack(require("./../webpack.config.js")))
      .pipe(gulp.dest("./build/js/"))
  );
});

gulp.task("server:dev", function () {
  return gulp.src("./build/").pipe(
    server({
      livereload: true,
      // directoryListing: true,
      open: true,
    })
  );
});

gulp.task("clean:dev", function (done) {
  if (fileSystem.existsSync("./build/")) {
    return gulp
      .src("./build/", { read: false, allowEmpty: true })
      .pipe(clean({ force: true }));
  }
  done();
});

gulp.task("watch:dev", function () {
  gulp.watch("./src/scss/**/*.scss", gulp.parallel("sass:dev"));
  gulp.watch("./src/**/*.html", gulp.parallel("html:dev"));
  gulp.watch("./src/img/**/*.*", gulp.parallel("images:dev"));
  gulp.watch("./src/img/**/*.*", gulp.parallel("avif:dev"));
  gulp.watch("./src/fonts/**/*.*", gulp.parallel("fonts:dev"));
  gulp.watch("./src/files/**/*.*", gulp.parallel("files:dev"));
  gulp.watch("./src/js/**/*.js", gulp.parallel("js:dev"));
});
