/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,js}"],
  theme: {
    extend: {
      colors: {
        textColor: '##D5D5D5',
        midiContainerBg: '',
        controlBarBg: '',
        trackContainerBg: '',
        trackColorDefault: '',
        trackColorSelected: '',
        trackColorHover: '',
        limeGreen: '#00ff62',
        'gridLineColor': '#303030',
        'measureLineColor': '#646464',
        pianoBg: '#303030',
      },
    },
  },
  plugins: [],
};
