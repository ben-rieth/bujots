const path = require('path');

/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: [
    path.join(__dirname, "./pages/**/*.{js,ts,jsx,tsx}"),
    path.join(__dirname, "./components/**/*.{js,ts,jsx,tsx}")
  ],
  theme: {
    extend: {
      boxShadow: {
        "md-top": "0 -4px 6px -1px rgb(0 0 0 / 0.1), 0 -2px 4px -2px rgb(0 0 0 / 0.1)"
      }
    },
  },
  plugins: [],
}
