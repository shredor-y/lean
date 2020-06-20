const 
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    include = require('gulp-file-include'),
    jsMin = require('gulp-uglify'),
    media = require('gulp-group-css-media-queries'),
    del = require('del'),
    cleanCss = require('gulp-clean-css'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    prefixer = require('gulp-autoprefixer');
// ===============================
const preproc = sass;
// ===============================
const path = {
    build: {
        html: './assets/build/',
        css: './assets/build/css/',
        fonts: './assets/build/fonts/',
        js: './assets/build/js/',
        images: './assets/build/images/',
    },
    src: {
        html: './assets/src/*.html',
        incHtml: './assets/src/html/',
        css: './assets/src/css/',
        fonts: './assets/src/fonts/**/*.*',
        js: './assets/src/js/**/*.*',
        images: './assets/src/images/**/*.*',
        preproc: './assets/src/sass/*.+(sass|scss|css)',
    },
    watch: {
        html: './assets/src/**/*.html',
        fonts: './assets/src/fonts/**/*.*',
        js: './assets/src/js/**/*.*',
        images: './assets/src/images/**/*.*',
        preproc: './assets/src/sass/**/*.+(sass|scss|css)',
    },
    del: {
        cleanBuild: './assets/build/',
        cleanFile: './assets/build/**/*.*',
    },
}
// ==========================
const configServer = {
    server: {
        baseDir: './assets/build/'
    },
    // nitify: false,
    // tunnel: false,
    host: 'localhost',
    port: 9000,
}
// ==========================
const htmlBuild = function(){
    return gulp
        .src(path.src.html)
        .pipe(include({
            prefix: '@',
            basepath: path.src.incHtml,
        }))
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({
            stream: true,
        }))
}
exports.htmlBuild = gulp.series(htmlBuild);
// ==========================
const styleBuild = function(){
    return gulp
        .src(path.src.preproc)
        .pipe(preproc())
        .pipe(prefixer())
        .pipe(media())
        .pipe(gulp.dest(path.src.css))
        .pipe(cleanCss())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}))
}
exports.styleBuild = gulp.series(styleBuild);
// ==========================
const fontsBuild = function(){
    return gulp
        .src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(reload({stream: true}))
}
exports.fontsBuild = gulp.series(fontsBuild);
// ==========================
const imgBuild = function(){
    return gulp
        .src(path.src.images)
        .pipe(gulp.dest(path.build.images))
        .pipe(reload({stream: true}))
}
exports.imgBuild = gulp.series(imgBuild);
// ==========================
const jsBuild = function(){
    return gulp
        .src(path.src.js)
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}))
}
exports.jsBuild = gulp.series(jsBuild);
// ==========================
const delBuild = function(){
    return del(path.del.cleanBuild);
}
exports.delBuild = gulp.series(delBuild);
// ==========================
const watcher = function(){
    gulp.watch(path.watch.html, htmlBuild);
    gulp.watch(path.watch.preproc, styleBuild);
    gulp.watch(path.watch.fonts, fontsBuild);
    gulp.watch(path.watch.images, imgBuild);
    gulp.watch(path.watch.js, jsBuild);
}
exports.watcher = gulp.series(watcher);
// ==========================
const server = function(){
    return browserSync(configServer);
}
exports.server = gulp.series(server);
// ==========================
exports.default = gulp.series(
    exports.build = gulp.series(
        delBuild,
        gulp.parallel(htmlBuild, styleBuild, fontsBuild, jsBuild, imgBuild )
    ),
    gulp.parallel(server, watcher),
)
