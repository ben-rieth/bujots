const path = require('path');

/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: [
    path.join(__dirname, "./pages/**/*.{js,ts,jsx,tsx}"),
    path.join(__dirname, "./components/**/*.{js,ts,jsx,tsx}")
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
