/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./**/*.html", "./modules/**/*.js", "./server.js"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["dim"],
  },
}

