/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      colors: {
        primary: '#9b1c1c', // rouge mexicain
        secondary: '#bea6a1', // sable nude
        crema: '#fdf6ec', // blanc cassé
        accent: '#275b00', // vert cactus
        charcoal: '#2F2F2F', // Negro Tostado
      },
      fontFamily: {
        sans: ['\'Josefin Sans\'', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      screens: {
        'mobiledesktop': '1000px',
      },
    },
  },
  plugins: [],
}

