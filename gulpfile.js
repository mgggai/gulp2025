import gulp from "gulp";
import fileInclude from "gulp-file-include";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import gulpPug from "gulp-pug";
import sass from "gulp-dart-sass";
import browserSyncModule from "browser-sync";
import { deleteAsync } from "del";
import sourceMaps from "gulp-sourcemaps";
import webpack from "webpack-stream";
import webpackConfig from "./webpack.config.js";
import babel from "gulp-babel";
import autoPrefixer from "gulp-autoprefixer";
import changed from "gulp-changed";
import csso from "gulp-csso";
import svgSprite from "gulp-svg-sprite";

const browserSync = browserSyncModule.create();

const plumberNotify = (title) => ({
	errorHandler: notify.onError({
		title,
		message: "Error <%= error.message %>",
		sound: false,
	}),
});

export const pug = () =>
	gulp
		.src(["./src/pug/*.pug", "!./src/pug/base.pug", "!./src/pug/mixins.pug"])
		.pipe(changed("./dist/"))
		.pipe(plumber(plumberNotify("Ошибка в PUG")))
		.pipe(gulpPug({ pretty: true }))
		.pipe(fileInclude({ prefix: "@@", basepath: "@file" }))
		.pipe(gulp.dest("./dist/"));

export const sassCompile = () =>
	gulp
		.src("./src/scss/*.scss")
		.pipe(changed("./dist/css/"))
		.pipe(plumber(plumberNotify("Ошибка в SCSS")))
		.pipe(sourceMaps.init())
		.pipe(sass())
		.pipe(csso())
		.pipe(
			autoPrefixer({
				cascade: false,
				grid: true,
				overrideBrowserslist: ["last 5 versions", "> 1%", "not dead"],
			})
		)
		.pipe(sourceMaps.write())
		.pipe(gulp.dest("./dist/css/"));

export const images = () =>
	gulp
		.src("./src/images/**/*")
		.pipe(changed("./dist/images/"))
		.pipe(gulp.dest("./dist/images/"));

export const fonts = () =>
	gulp
		.src("./src/fonts/**/*")
		.pipe(changed("./dist/fonts/"))
		.pipe(gulp.dest("./dist/fonts/"));

export const files = () =>
	gulp
		.src("./src/files/**/*")
		.pipe(changed("./dist/files/"))
		.pipe(gulp.dest("./dist/files/"));

export const js = () =>
	gulp
		.src("./src/js/*.js")
		.pipe(changed("./dist/js/"))
		.pipe(plumber(plumberNotify("Ошибка в JS")))
		.pipe(babel())
		.pipe(webpack(webpackConfig))
		.pipe(gulp.dest("./dist/js/"));

const configSVG = {
	mode: {
		symbol: {
			sprite: "../../sprite.svg",
		},
	},
	shape: {
		transform: [
			{
				svgo: {
					js2svg: { indent: 4, pretty: true },
				},
			},
		],
	},
};

export const svgsprite = () => {
	return gulp
		.src("./src/images/svgicons/*.svg")
		.pipe(changed("./dist/images/svgicons/"))
		.pipe(svgSprite(configSVG))
		.pipe(gulp.dest("./dist/images/svgicons/"));
};

export const server = () =>
	browserSync.init({
		watch: true,
		server: {
			baseDir: "./dist/",
		},
		notify: false,
	});

export const clean = () => deleteAsync(["./dist"]);

export const watch = () => {
	gulp.watch("./src/scss/**/*.scss", gulp.parallel(sassCompile));
	gulp.watch("./src/pug/**/*.pug", gulp.parallel(pug));
	gulp.watch("./src/images/**/*", gulp.parallel(images));
	gulp.watch("./src/fonts/**/*", gulp.parallel(fonts));
	gulp.watch("./src/files/**/*", gulp.parallel(files));
	gulp.watch("./src/js/**/*.js", gulp.parallel(js));
	gulp.watch("./src/images/svgicons/**/*", gulp.parallel(svgsprite));
};

export const build = gulp.series(
	clean,
	gulp.parallel(pug, sassCompile, images, fonts, files, js, svgsprite)
);

export default gulp.series(build, gulp.parallel(server, watch));
