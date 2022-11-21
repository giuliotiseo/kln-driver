/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.js", './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#2cdda8',
          200: '#1CAE81',
          300: '#1A9E76'
        },
        secondary: {
          100: '#0A445C',
          200: '#073042',
          300: '#062937',
        },
        tertiary: {
          100: '#0267A2',
          200: '#008BAA',
          300: '#7fc3ea',
        },
        light: {
          50: '#d9dee8',
          100: '#ffffff',
          200: '#f7f9fc',
          300: '#f4f6fb',
        },
        neutral: {
          100: "#42444B",
          200: "#fcfcfd"
        },
        dark: {
          50: '#0c0e12',
          100: '#2d3037',
          200: '#22252C',
          300: '#161a21'
        },
        danger: {
          100: '#9A1D1D',
          200: '#B42222',
          300: '#DE5454'
        },
        success: {
          100: '#55C595',
          200: '#7ce495',
          300: '#CFF4D2',
        },
      },
      flex: {
        2: '2 2 0%',
        3: '3 3 0%',
        4: '4 4 0%',
        5: '5 5 0%',
        6: '6 6 0%',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(var(--tw-gradient-stops))',
        'login': "url('/public/images/cart-pallet-vertical.png')",
        'buildings': "url('/public/images/buildings-1.jpg')",
        'warehouse': "url('/public/images/warehouse.jpg')",
      },
    },
  },
  plugins: [],
};
