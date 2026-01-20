// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',                 
  content: [
    "./index.html",
    "./src//*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0f1419',
          surface: '#1a1f2e',
          surface2: '#252d3d',
          border: '#3a4452',
          text: '#e8eaed',
          textMuted: '#9ca3af',
        }
      }
    },
  },
  plugins: [],
};