/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ["var(--font-geist-sans)"],
				mono: ["var(--font-geist-mono)"],
			},
		},
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: [
			"light",
			"dark",
			{
				clipcloud: {
					primary: "#3b82f6",
					secondary: "#8b5cf6",
					accent: "#06b6d4",
					neutral: "#1f2937",
					"base-100": "#ffffff",
					"base-200": "#f3f4f6",
					"base-300": "#e5e7eb",
					"base-content": "#1f2937",
					info: "#0ea5e9",
					success: "#22c55e",
					warning: "#f59e0b",
					error: "#ef4444",
				},
			},
		],
		darkTheme: "dark",
		base: true,
		styled: true,
		utils: true,
		prefix: "",
		logs: false,
		themeRoot: ":root",
	},
};
