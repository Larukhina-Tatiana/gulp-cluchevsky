const gulp = require("gulp");
// taskc для разработки
require("./gulp/dev.js");
gulp.task(
  "default",
  gulp.series(
    "clean:dev",
    gulp.parallel(
      "html:dev",
      "sass:dev",
      "avif:dev",
      "images:dev",
      "fonts:dev",
      "files:dev",
      "js:dev"
    ),
    gulp.parallel("server:dev", "watch:dev")
    //   "clean"
  )
);
// для  готового проэкта
require("./gulp/docs.js");
gulp.task(
  "docs",
  gulp.series(
    "clean:docs",
    gulp.parallel(
      "html:docs",
      "sass:docs",
      "images:docs",
      "fonts:docs",
      "files:docs",
      "js:docs"
    ),
    gulp.parallel("server:docs")
    //   "clean"
  )
);
