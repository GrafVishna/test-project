// Импорт пакетов
const gulp         = require('gulp')
const less         = require('gulp-less')
const stylus       = require('gulp-stylus')
const sass         = require('gulp-sass')(require('sass'))
const rename       = require('gulp-rename')
const cleanCSS     = require('gulp-clean-css')
const ts           = require('gulp-typescript')
//const coffee     = require('gulp-coffee')
const babel        = require('gulp-babel')
const uglify       = require('gulp-uglify')
const concat       = require('gulp-concat')
const sourcemaps   = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const imagemin     = require('gulp-imagemin')
const htmlmin      = require('gulp-htmlmin')
const size         = require('gulp-size')
//const gulppug    = require('gulp-pug')
const newer        = require('gulp-newer')
const browsersync  = require('browser-sync').create()
const del          = require('del')
const webp         = require('gulp-webp')

// Пути исходных файлов src и пути к результирующим файлам dest ========

const paths = {
  html: {
    src: ['src/html/*.html', 'src/*.pug'],
    dest: 'dist/'
  },
  htmlbuild: {
    src: ['src/html/*.html', 'src/*.pug'],
    dest: 'build/'
  },
  icons: {
    src: ['src/img/icons/*.png', 'src/img/icons/*.svg', 'src/img/icons/*.ico', 'src/img/icons/*.bmp',],
    dest: 'dist/img/icons/'
  },
  iconsbuild: {
    src: ['src/img/icons/*.png', 'src/img/icons/*.svg', 'src/img/icons/*.ico', 'src/img/icons/*.bmp',],
    dest: 'build/img/icons/'
  },
  styles: {
    src: ['src/styles/**/*.sass', 'src/styles/**/*.scss', 'src/styles/**/*.styl', 'src/styles/**/*.less', 'src/styles/**/*.css'],
    dest: 'dist/css/'
  },
  stylesmin: {
    src: ['src/styles/**/*.sass', 'src/styles/**/*.scss', 'src/styles/**/*.styl', 'src/styles/**/*.less', 'src/styles/**/*.css'],
    dest: 'build/css/'
  },
  scripts: {
    src: ['src/scripts/**/*.coffee', 'src/scripts/**/*.ts', 'src/scripts/**/*.js'],
    dest: 'dist/js/'
  },
  images: {
    src: 'src/img/**',
    dest: 'dist/img/'
  },
  webp: {
    src: 'src/img/**',
    dest: 'dist/img/'
  }
}

// Очистить каталог dist, удалить все кроме изображений =========

function clean() {
  return del(['dist/*', '!dist/img'])
}

// Обработка html и pug ==========================================

function html() {
  return gulp.src(paths.html.src)
    //.pipe(gulppug())
    .pipe(htmlmin({ collapseWhitespace: false }))
    .pipe(size({
      showFiles: true
    }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browsersync.stream())
}
    // Билд
function htmlbuild() {
  return gulp.src(paths.html.src)
    //.pipe(gulppug())
    .pipe(htmlmin({ collapseWhitespace: false }))
    .pipe(size({
      showFiles: true
    }))
    .pipe(gulp.dest(paths.htmlbuild.dest))
    .pipe(browsersync.stream())
}

// Обработка препроцессоров стилей ===============================

        // С сжатием css - Билд
function stylesmin() {
  return gulp.src(paths.stylesmin.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 5 versions'],
      grid: true,
      cascade: true
    }))
     .pipe(cleanCSS({
      level: 2
    }))
    .pipe(concat('min.style.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.stylesmin.dest))
  }
      // Без сжатия css 
function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 5 versions'],
      cascade: true
    }))
    .pipe(concat('style.css'))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browsersync.stream())
}

// Обработка Java Script, Type Script и Coffee Script =========================

function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(concat('script.js'))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browsersync.stream())
}
    // С сжатием Билд
function scriptsmin() {
  return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/scripts'))
}

// Сжатие изображений  ==================================================

    // перемещение иконок
function icons() {
  return gulp.src(paths.icons.src)
    .pipe(gulp.dest(paths.icons.dest))
    .pipe(browsersync.stream())
};
function iconsbuild() {
  return gulp.src(paths.icons.src)
    .pipe(gulp.dest(paths.icons.dest))
};
    // Конвертация в WebP
function imgp() {
  return gulp.src(paths.images.src)
    .pipe(webp())
    .pipe(gulp.dest('build/img'))
    .pipe(browsersync.stream())
};
    // Простое сжатие
function img() {
  return gulp.src(paths.images.src)
    // .pipe(newer('paths.images.dest'))
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(size({
      showFiles: true
    }))
    .pipe(gulp.dest(paths.images.dest))
    .pipe(browsersync.stream())
}

// Отслеживание изменений в файлах и запуск лайв сервера =========================
function watch() {
  browsersync.init({
    server: {
      baseDir: "./dist"
    }
  })
  gulp.watch(paths.html.dest).on('change', browsersync.reload)
  gulp.watch(paths.html.src, html)
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.scripts.src, scripts)
  gulp.watch(paths.images.src, img)
  gulp.watch(paths.icons.src, icons)
}

// Таски для ручного запуска с помощью gulp clean, gulp html и т.д.
exports.clean = clean
exports.html = html
exports.htmlbuild = htmlbuild
exports.styles = styles
exports.stylesmin = stylesmin
exports.scripts = scripts
exports.scriptsmin = scriptsmin
exports.icons = icons
exports.iconsbuild = iconsbuild
exports.img = img
exports.imgp = imgp
exports.watch = watch


// Таск, который выполняется по команде gulp
exports.default = gulp.series(clean, html, gulp.parallel(styles, scripts, icons, img))
exports.build = gulp.series(clean, htmlbuild, gulp.parallel(stylesmin, scriptsmin, iconsbuild, imgp))