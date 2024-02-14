/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    screens: {
      sm: '481px',
      md: '769px',
      lg: '977px',
      xl: '1441px',
    },
    colors: {
      transparent: 'transparent',
      black: '#000',
      white: '#fff',
    },
    extend: {},
  },
  plugins: [],
}

