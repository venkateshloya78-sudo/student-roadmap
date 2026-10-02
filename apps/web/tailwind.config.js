/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff',
          100: '#e0eaff',
          200: '#c0d4ff',
          300: '#90b3ff',
          400: '#5a8fff',
          500: '#3b6ff0',
          600: '#2451d4',
          700: '#1a3aab',
          800: '#152e8a',
          900: '#112471',
        },
        accent: {
          400: '#f59e0b',
          500: '#d97706',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
