/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fffbeb',
          100: '#fff4c6',
          200: '#ffed9f',
          300: '#ffe577',
          400: '#ffde50',
          500: '#FFDE00', // Main yellow from fermesolaire.fr
          600: '#e6c700',
          700: '#ccb000',
          800: '#b39900',
          900: '#998200',
        },
        secondary: {
          50: '#f3f2ff',
          100: '#e9e7ff',
          200: '#d4d0ff',
          300: '#bfb9ff',
          400: '#aaa1ff',
          500: '#594FF4', // Main purple from fermesolaire.fr
          600: '#4840C9',
          700: '#3a339e',
          800: '#2c2673',
          900: '#1e1948',
        },
        dark: {
          DEFAULT: '#211F1B', // Main dark text from fermesolaire.fr
        }
      },
    },
  },
  plugins: [],
}
