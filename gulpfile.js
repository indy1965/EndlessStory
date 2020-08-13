"use strict";
/* -----------------------------*/
/* Константы */
/* -----------------------------*/
const {src, dest} = require('gulp'),
  gulp = require('gulp'),
  browsersync = require('browser-sync').create(),
  plumber = require('gulp-plumber'), // Предотвращает поломку таска
  del = require('del'),             // Удаление файлов и папок
  rename = require("gulp-rename"),  // Переименовывает файлы
  fs = require('fs'),
  //* html
  fileinclude = require('gulp-file-include'), // компилирует ряд HTML-страниц,
  //* css
  scss = require('gulp-sass'),      // Компиляция scss
  autoprefixer = require('gulp-autoprefixer'), // Добавление префиксов
  groupMedia = require('gulp-group-css-media-queries'), // Группирует из всех файлов медиа зарпосы в конец css файла
  cssbeautify = require('gulp-cssbeautify'), // Делает код css красивым
  cleanCSS = require('gulp-clean-css'),  // Чистит и сжимает css файлы на выходе.
  //sourcemaps = require('gulp-sourcemaps'), // Сооздание map файла. для разработки
  //* js
  uglify = require('gulp-uglify'), // Сжимаем js файл
  babel = require('gulp-babel'),
  webpackStream = require('webpack-stream'),
  //* image
  imagemin = require('gulp-imagemin'), // Плагин сжатия картинок
  svgSprite = require('gulp-svg-sprite'), // Плагин для создания svg спрайтов
  //webp = require('gulp-webp'), // Конвертация картинок в формат WEBP
  //webpHtml = require('gulp-webp-html'), // Подключение картинок формата WEBP в HTML
  //webpCss = require("gulp-webpcss"),  // Подключение картинок формата WEBP в CSS
  //* fonts
  ttf2woff = require('gulp-ttf2woff'), // Конвертация шрифотов ttf -> woff
  ttf2woff2 = require('gulp-ttf2woff2'),  // Конвертация шрифотов ttf -> woff2
  fonter = require('gulp-fonter');  // Конвертация шрифотов otf



const project_folder = 'dist';
const source_folder = 'src';

/* Paths */
const path = {
  build:{
    html: project_folder + '/',
    css: project_folder + '/assets/css/',
    js: project_folder + '/assets/js/',
    img: project_folder + '/assets/img/',
    fonts: project_folder + '/assets/fonts/',
  },
  src: {
    html: {
      dir: source_folder,
      file: source_folder + '/*.html',
    },
    css: {
      dir: source_folder + '/assets/scss',
      file: source_folder + '/assets/scss/style.scss',
    },
    js:{
      dir: source_folder + '/assets/js',
      file:source_folder + '/assets/js/main.js',
    } ,
    img:{
      dir: source_folder + '/assets/img',
      file: source_folder + '/assets/img/**/*.{jpg,png,svg,gif,ico,webp}',
    } ,
    fonts:{
      dir: source_folder + '/assets/fonts',
      file: source_folder + '/assets/fonts/*.ttf',
    } ,
  },
  watch: {
    html: source_folder + '/**/*.html',
    css: source_folder + '/assets/scss/**/*.scss',
    js: source_folder + '/assets/js/**/*.js',
    img: source_folder + '/assets/img/**/*.{jpg,png,svg,gif,ico,webp}',
  },
  clean: './' + project_folder + '/',
}

/* -----------------------------*/
/* Задачи */
/* -----------------------------*/
gulp.task( 'clean', () =>{
  return del(path.clean);
});

// Обрабатываем html
gulp.task( 'build-html', () =>{
  return src(path.src.html.file)
    .pipe(plumber())
    .pipe(fileinclude())
    //.pipe(webpHtml())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
});

// Обрабатываем scss
gulp.task( 'build-css', ()=>{
  return src(path.src.css.file)
    //.pipe(sourcemaps.init())
    //.pipe(plumber())            // Предотвращает поломку таска
    .pipe(                      // Компиляция scss
      scss({
        outputStyle: 'expanded'
      })
    )
    .pipe( groupMedia() )       // Группирует из всех файлов медиа зарпосы в конец css файла
    .pipe(
      autoprefixer({            // Добавление префиксов
        overrideBrowserslist: ['last 5 versions'],
        cascade: true
      })
    )
    //.pipe(webpCss())
    .pipe(cssbeautify())        // Делаем код css красивым
    .pipe(
      rename({
        prefix: "main-",                 // Переименовывает файлы
      }))
    .pipe(dest(path.build.css)) // Сохраняем не минифицированый файл стилей
    .pipe( cleanCSS({level: { 1: { specialComments: 0 } } }) )         // Чистит и сжимает css файлы на выходе.
    .pipe(
      rename({                // Переименовывает файлы
        suffix: '.min',
        extname: '.css'
      })
    )
    //.pipe(sourcemaps.write('.')) // пути для записи SourceMaps
    .pipe(dest(path.build.css)) // Сохраняем минифицированый файл стилей
    .pipe(browsersync.stream()); // Обновляем браузер
});

// Обрабатываем js
gulp.task( 'js',() => {
  return src(path.src.js.file)
    .pipe(plumber())
    .pipe(dest(path.build.js))
    .pipe(
      babel({
        presets: ['@babel/env']
      })
    )
    .pipe( uglify() )
    .pipe(
      rename({
        suffix: '.min',
        extname: '.js'
      })
    )
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
});

// Собираем JS с помощью Webpack
// Сборка для разрработки
gulp.task("build-js", () => {
  return gulp.src( path.src.js.file)
    .pipe(plumber())
    .pipe(webpackStream({
        mode: 'development',  // Режим разработки
        output: {
            filename: 'script.js' // Выходной файл
        },
        watch: false,
        //devtool: "source-map", // Создание файла source-map
        module: {
            rules: [
              {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/, // для поиска внешних модулей
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['env']
                  }
                }
              }
            ]
          }
    }))
    .pipe(dest(path.build.js))
    .pipe( uglify() )
    .pipe(
      rename({
        suffix: '.min',
        extname: '.js'
      })
    )
    .pipe(dest(path.build.js))
    .on("end", browsersync.reload);
});
// Обработка  js для продакшена
gulp.task("build-prod-js", () => {
  return gulp.src(path.src.js.file)
    .pipe(plumber())
    .pipe(webpackStream({
        mode: 'production',  // Режим продакшн
        output: {
            filename: 'script.js' // Выходной файл
        },
        module: {
            rules: [
              {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['env']
                  }
                }
              }
            ]
          }
    }))
    .pipe(dest(path.build.js))
    .pipe( uglify() )
    .pipe(
      rename({
        suffix: '.min',
        extname: '.js'
      })
    )
    .pipe(dest(path.build.js))
});

// Обрабатываем Картинки
gulp.task( 'build-images',() =>{
  return src(path.src.img.file)
    .pipe(plumber())
    // .pipe(
    //   webp({
    //     quality: 70
    //   })
    // )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img.file))
    .pipe(
      imagemin({
        interlaced: true,
        progressive: true,
        optimizationLevel: 3,
        svgoPlugins: [
            {
                removeViewBox: false
            }
        ]}
      )
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream());
});

function cb(){

}

/* Прописываем стили в файл _fonts.scss  */
gulp.task( 'fontsStyle',async () => {
  let file_content = fs.readFileSync(path.src.css.dir +'/basic/_fonts.scss');
  if (file_content == '') {
    fs.writeFile(path.src.css.dir +'/basic/_fonts.scss', '', cb);
    return fs.readdir(path.build.fonts,  (err, items) => {
      if (items) {
        let c_fontname;
        for (var i = 0; i < items.length; i++) {
          let fontname = items[i].split('.');
          fontname = fontname[0];

          if (c_fontname != fontname) {
            fs.appendFile(path.src.css.dir +'/basic/_fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
          }
          c_fontname = fontname;
        }
      }
    });
  }
});


/* Создание шрифотов wof, wof2 из ttf  */
gulp.task( 'build-fonts', () => {
  src(path.src.fonts.file)
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts));
  return src(path.src.fonts.file)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts));
});


/* Задача для конвертации шрифта otf в ttf */
gulp.task('otf2ttf', () =>{
  return gulp.src([path.src.fonts.dir + '/*.otf'])
    .pipe(fonter({
      format: ['ttf']
    }))
    .pipe(dest(path.src.fonts.dir));
});

/* Задача для создания svg спрвйта иконок */
gulp.task('svgSprite', () =>{
  return gulp.src([source_folder + '/assets/iconsprite/*.svg'])
  //.pipe(plumber())
  .pipe(svgSprite({
    mode: {
      stack: {
        sprite: '../icons/icons.svg',
        //example: true // Создается файл примера использования спрайтов.
      }
    },
  }))
  .pipe(dest(path.src.img.dir));
});

/* -----------------------------*/
// Слежка за файлами

gulp.task('watch',() => {
  browsersync.init({
    server: {
      baseDir: './' + project_folder + '/'
    },
    port: 3000,
    notify: false
  });
  gulp.watch([path.watch.html], gulp.parallel( 'build-html'));
  gulp.watch([path.watch.css],{readDelay: 2000}, gulp.parallel('build-css'));
  gulp.watch([path.watch.js], gulp.parallel('build-js'));
  gulp.watch([path.watch.img], gulp.parallel('build-images'));
});

/* -----------------------------*/
gulp.task("build", gulp.series('clean',gulp.parallel('build-js', 'build-css', 'build-html', 'build-images', 'build-fonts'), 'fontsStyle' ));

gulp.task("default", gulp.parallel("watch", "build"));
