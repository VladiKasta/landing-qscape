const gulp = require("gulp")
const sass = require("gulp-sass")(require("sass"))
const browserSync = require("browser-sync").create()
const fileInclude = require("gulp-file-include")
const clean = require("gulp-clean")
const postcss = require("gulp-postcss")
const tailwindcss = require("tailwindcss")
const autoprefixer = require("autoprefixer")
const uglify = require("gulp-uglify")
const filter = require("gulp-filter")

// Пути
const paths = {
	src: {
		html: "src/**/*.html", // все HTML, включая partials
		partials: "src/partials/**/*.html", // сами partials
		scss: [
    "src/scss/**/*.scss", // рекурсивно все SCSS файлы
    "!src/scss/media.scss"
],
		media: "src/scss/media.scss", // отдельный путь
		js: ["node_modules/inputmask/dist/inputmask.min.js", "src/js/**/*.js"],
	},
	dist: {
		html: "dist/",
		css: "dist/css/",
		js: "dist/js/",
		assets: "dist/assets/",
	},
}

// Очистка dist
function cleanDist() {
	return gulp.src("dist", { read: false, allowEmpty: true }).pipe(clean())
}

// Сборка HTML
function html() {
	// Фильтр: не записывать partials в dist
	const htmlFilter = filter(file => !/\/partials\//.test(file.path), { restore: true })

	return gulp
		.src(paths.src.html) // берем все html, включая partials
		.pipe(
			fileInclude({
				prefix: "@@",
				basepath: "@file",
				cache: false,
			})
		)
		.pipe(htmlFilter) // исключаем partials на этапе записи
		.pipe(gulp.dest(paths.dist.html))
		.pipe(browserSync.stream())
}

// Компиляция SCSS с Tailwind
function scss() {
	return gulp
		.src(paths.src.scss)
		.pipe(sass().on("error", sass.logError))
		.pipe(postcss([tailwindcss("./tailwind.config.js"), autoprefixer()]))
		.pipe(gulp.dest(paths.dist.css))
		.pipe(browserSync.stream())
}

// Компиляция media.scss
function mediaScss() {
	return gulp
		.src(paths.src.media)
		.pipe(sass().on("error", sass.logError))
		.pipe(postcss([tailwindcss("./tailwind.config.js"), autoprefixer()]))
		.pipe(gulp.dest(paths.dist.css))
		.pipe(browserSync.stream())
}

// Копирование JS
function js() {
	return (
		gulp
			.src(paths.src.js)
			// .pipe(uglify()) // при желании включи минификацию
			.pipe(gulp.dest(paths.dist.js))
			.pipe(browserSync.stream())
	)
}

// Копирование ассетов
function assets() {
	return gulp
		.src(
			["src/assets/icons/**/*", "src/assets/img/**/*", "src/assets/fonts/**/*"],
			{ base: "src/assets" },
			{ encoding: false }
		)
		.pipe(gulp.dest(paths.dist.assets))
		.pipe(browserSync.stream())
}

// Сервер + вотчеры
function serve() {
	browserSync.init({
		server: { baseDir: "dist" },
		mimeTypes: { css: "text/css" },
		port: 3000,
		open: true,
	})

	gulp.watch(paths.src.scss, scss)
	gulp.watch(paths.src.media, mediaScss)

	// Следим за любыми изменениями html (включая partials)
	gulp.watch(paths.src.html, html)

	gulp.watch(paths.src.js, js)
	gulp.watch(["src/assets/icons/**/*", "src/assets/img/**/*", "src/assets/fonts/**/*"], assets)
	gulp.watch("./tailwind.config.js", scss)
}

// Сборка
const build = gulp.series(cleanDist, gulp.parallel(html, scss, mediaScss, assets, js))
const dev = gulp.series(build, serve)

// Экспорт задач
exports.clean = cleanDist
exports.html = html
exports.scss = scss
exports.mediaScss = mediaScss
exports.js = js
exports.assets = assets
exports.build = build
exports.default = dev
