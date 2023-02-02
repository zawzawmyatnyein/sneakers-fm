const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './js/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Kumbh Sans', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        orange: 'hsl(26, 100%, 55%)',
        'orange-pale': 'hsl(25, 100%, 94%)',
        'dark-blue': 'hsl(220, 13%, 13%)',
        'dark-gray-blue': ' hsl(219, 9%, 45%)',
        'gray-blue': 'hsl(220, 14%, 75%)',
        'light-gray-blue': 'hsl(223, 64%, 98%)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
