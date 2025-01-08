module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/layouts/**/*.{js,ts,jsx,tsx}',
    './src/services/**/*.{js,ts,jsx,tsx}',
    './node_modules/@sk-web-gui/*/dist/**/*.js',
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom': '0 0 3px 0 rgba(10,12,15,0.08),0 1px 8px 0 rgba(10,12,15,0.13)',
      },
      // if you want to override max content width
      // maxWidth: {
      //   content: screens['desktop-max'], // default in core is based on screens
      // },
    }
  },
  darkMode: 'class', // or 'media' or 'class'
  presets: [require('@sk-web-gui/core').preset()],
  // plugins: [require('@tailwindcss/forms'), require('@sk-web-gui/core')],
};
