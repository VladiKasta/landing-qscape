const gulp = require("gulp")
const sass = require("gulp-sass")(require("sass"))
const browserSync = require("browser-sync").create()
const fileInclude = require("gulp-file-include")
const clean = require("gulp-clean")
const postcss = require("gulp-postcss")
const tailwindcss = require("tailwindcss")
const autoprefixer = require("autoprefixer")
const uglify = require("gulp-uglify")

// Пути к файлам
const paths = {
	src: {
		html: "src/**/*.html",
		scss: ["src/scss/**/*.scss", "!src/scss/media.scss"], // все кроме media.scss
		media: "src/scss/media.scss", // отдельный путь
		js: "src/js/**/*.js",
	},
	dist: {
		html: "dist/",
		css: "dist/css/",
		js: "dist/js/",
		assets: "dist/assets/",
	},
}

// Очистка папки dist
function cleanDist() {
	return gulp.src("dist", { read: false, allowEmpty: true }).pipe(clean())
}

// Сборка HTML с подключением шаблонов
function html() {
	return gulp
		.src([paths.src.html, "./src/partials/**/*.html"])

		.pipe(
			fileInclude({
				prefix: "@@",
				basepath: "@file",
			})
		)
		.pipe(gulp.dest(paths.dist.html))
		.pipe(browserSync.stream())
}

// Компиляция SCSS с Tailwind CSS
function scss() {
	return gulp
		.src(paths.src.scss)
		.pipe(sass().on("error", sass.logError))
		.pipe(postcss([tailwindcss("./tailwind.config.js"), autoprefixer()]))
		.pipe(gulp.dest(paths.dist.css))
		.pipe(browserSync.stream())
}

function mediaScss() {
	return gulp
		.src("src/scss/media.scss") // путь к media.scss
		.pipe(sass().on("error", sass.logError))
		.pipe(postcss([tailwindcss("./tailwind.config.js"), autoprefixer()]))
		.pipe(gulp.dest(paths.dist.css))
		.pipe(browserSync.stream())
}

function js() {
	return (
		gulp
			.src(paths.src.js)
			/* .pipe(uglify())  */ // Минификация JS (опционально)
			.pipe(gulp.dest(paths.dist.js))
			.pipe(browserSync.stream())
	)
}

// Копирование статических файлов

// Копирование статических файлов
function assets() {
	return gulp
		.src(["src/assets/icons/**/*", "src/assets/img/**/*", "src/assets/fonts/**/*"], { base: "src/assets" }, { encoding: false }) // Указываем базовый путь
		.pipe(gulp.dest("dist/assets"))
		.pipe(browserSync.stream())
}

// Настройка live-режима
function serve() {
	browserSync.init({
		server: {
			baseDir: "dist",
		},
		mimeTypes: {
			css: "text/css", // Явно указать MIME-тип для CSS
		},

		port: 3000,
		open: true,
	})

	gulp.watch(paths.src.scss, scss)
	gulp.watch("src/scss/media.scss", mediaScss)
	gulp.watch([paths.src.html, "src/partials/**/*.html"], gulp.series(html, scss))
	gulp.watch(paths.src.html, html)

	gulp.watch(paths.src.js, js)
	gulp.watch(["src/assets/icons/**/*", "src/assets/img/**/*", "src/assets/fonts/**/*"], assets)
	gulp.watch("./tailwind.config.js", scss) // Следим за изменениями в tailwind.config.js
}

// Основная задача сборки
const build = gulp.series(cleanDist, gulp.parallel(html, scss, mediaScss, assets, js))

// Задача для разработки
const dev = gulp.series(build, serve)

// Экспорт задач
exports.clean = cleanDist
exports.html = html
exports.scss = scss
exports.js = js
exports.assets = assets
exports.build = build
exports.default = dev
