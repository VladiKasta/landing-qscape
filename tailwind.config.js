/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/**/*.html", // Включает index.html и partials
		"./src/partials/**/*.html", // Явное указание partials
		"./src/**/*.js", // Укажите пути к шаблонам
	],
	theme: {
		screens: {
			"2xl": { max: "1420px" },
			xl: { max: "1280px" },
			lg: { max: "992px" },
			md: { max: "767px" },
			sm: { max: "639px" },
		},
		extend: {
			width: {
				// Пользовательские процентные значения для ширины
				10: "10%",
				20: "20%",
				25: "25%",
				30: "30%",
				33: "33.333333%",
				40: "40%",
				50: "50%",
				60: "60%",
				66: "66.666667%",
				70: "70%",
				75: "75%",
				80: "80%",
				90: "90%",
				100: "100%",
			},
		},
	},
	plugins: [],
}
