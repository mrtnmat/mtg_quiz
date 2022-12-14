/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html',
            './src/*.js'],
  theme: {
    extend: {
      fontFamily: {
        'magic': ['Beleren\\ Bold', 'sans-serif']
      },
      height: {
        '144': '36rem',
      }
    },
  },
  plugins: [],
}
