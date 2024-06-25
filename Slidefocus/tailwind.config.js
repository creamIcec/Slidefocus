const colors = require('tailwindcss/colors');

module.exports = {
  content: ['./src/renderer/**/*.{js,jsx,ts,tsx,ejs}'],
  darkMode: 'selector', // or 'media' or 'class'
  theme: {
    fontFamily: {
      hanserifr: ["'Source Han Serif Regular'"],
      hanserifb: ["'Source Han Serif Bold'"],
      hanserifh: ["'Source Han Serif Heavy'"],
    },
    extend: {
      colors: {
        sky: colors.sky,
        cyan: colors.cyan,
        bg: '#ECEAF1',
        primary: '#FFE28E',
        secondary: '#FFDAE8',
        tertiary: '#F9F871',
        bgc: '#DCD3F2',
        bg_dark: '#19171C',
        primary_dark: '#31283D',
        secondary_dark: '#93535F',
        tertiary_dark: '#D17B64',
        bgc_dark: '#31283D',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
