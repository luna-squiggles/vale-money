/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        white: '#F7F9F9',
        black: '#252627',
        brand: {
          blue: '#102542',
          cream: '#FCF5E5',
          red: '#B8336A',
          green: '#468189',
        },
      },
    },
  },
  plugins: [],
};
