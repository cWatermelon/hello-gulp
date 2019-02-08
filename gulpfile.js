/*
 *	created by chencheng 2016/11/03
 *	git url ：https://git.oschina.net/WatermeLonMan/gulp.git
 */
const gulp = require('gulp');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const minifyCss = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const babel = require('gulp-babel');
const minifyHtml = require('gulp-minify-html');
const cache = require('gulp-cache');
const browserSync = require('browser-sync').create();
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const { reload } = browserSync;
const handleErrors = require('./util/handleErrors');
const sourcemaps = require('gulp-sourcemaps');
const changed = require('gulp-changed');
const rev = require('gulp-rev');
const sequence = require('run-sequence');
const revCollector = require('gulp-rev-collector');
const proxy = require('http-proxy-middleware');

const jsDist = './dist/js';
const cssDist = './dist/css';
const imgDist = './dist/imgs';
const dist = './dist';

/**
 * 代理配置
 * @type {Array}
 * 多个接口api 则配置多个proxy
 */
var proxy_options = [
  proxy('/api', {
    target: 'http://example.com', // 代理跳转url
    changeOrigin: true, // 改变原始host
  }),
  proxy('/api', {
    target: 'http://example.com', // 代理跳转url
    changeOrigin: true, // 改变原始host
  }),
];

// 压缩编译css
gulp.task('minifyCss', function() {
  gulp
    .src(['src/css/*.scss', 'src/css/*.css'])
    .pipe(changed(cssDist)) //添加修改后的文件后缀
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(
      autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4')
    )
    .pipe(minifyCss())
    .pipe(sourcemaps.write('./'))
    .pipe(rev())
    .pipe(revCollector())
    .pipe(gulp.dest(cssDist))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/css'))
    .pipe(reload({ stream: true }))
    .pipe(notify('css 编译完成'));
});

// js操作
gulp.task('minifyJs', function() {
  gulp
    .src('src/js/*.js')
    .pipe(changed(jsDist)) //添加修改后的文件后缀
    .pipe(sourcemaps.init())
    .pipe(
      plumber({
        errorHandler: handleErrors,
      })
    )
    .pipe(
      babel({
        presets: ['@babel/env'],
      })
    )
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(rev())
    .pipe(revCollector())
    .pipe(gulp.dest(jsDist))
    .pipe(rev.manifest())
    .pipe(gulp.dest('rev/js'))
    .pipe(reload({ stream: true }))
    .pipe(notify('js 编译完成'));
});

// 压缩图片
gulp.task('images', function() {
  gulp
    .src('src/images/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(plumber())
    .pipe(gulp.dest(imgDist))
    .pipe(reload({ stream: true }))
    .pipe(notify('图片 压缩完成'));
});

// 压缩html
gulp.task('minifyHtml', function() {
  gulp
    .src(['rev/**/*.json', 'src/*.html'])
    .pipe(changed(dist))
    .pipe(minifyHtml())
    .pipe(revCollector())
    .pipe(gulp.dest(dist))
    .pipe(reload({ stream: true }))
    .pipe(notify('html 压缩完成'));
});

//清空文件夹
gulp.task('clean', function() {
  gulp
    .src(dist + '/*/*', { read: false })
    .pipe(clean())
    .pipe(notify('build 清空完成'));
});

// Watch 改动
gulp.task('watch', function() {
  // Watch .scss 改动
  gulp.watch('src/*/*.scss', ['minifyCss']);
  gulp.watch('src/*/*.css', ['minifyCss']);
  // Watch .js 改动
  gulp.watch('src/*/*.js', ['minifyJs']);
  // Watch image 改动
  gulp.watch('src/images/*', ['images']);
  // Watch html 改动
  gulp.watch('src/*.html', ['minifyHtml']);
});

// 静态服务器
gulp.task('server', function() {
  browserSync.init({
    server: dist, //本地项目地址
    port: 4000, //本地端口
    middleware: proxy_options,
  });
  sequence(['clean'], ['images'], ['minifyCss'], ['minifyJs'], ['minifyHtml']);
  gulp
    .watch(['build/*.html', 'build/css/*.scss', 'build/js/*.js', 'build/images/*'])
    .on('change', reload);
});

gulp.task('default', function() {
  gulp.start('server', 'watch');
});
