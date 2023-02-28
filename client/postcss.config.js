const tailwindcss = require('tailwindcss');
const postcssScss = require('postcss-scss');

module.exports = {
  syntax: postcssScss,
  plugins: [tailwindcss('./tailwind.config.js')],
};