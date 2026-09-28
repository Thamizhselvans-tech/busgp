/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          blue: '#0B4F6C',
          darkBlue: '#011627',
          lightBlue: '#E0F2FE',
          teal: '#00A896',
          gold: '#F4A261',
          danger: '#E63946',
          success: '#2A9D8F',
          warning: '#E76F51',
          bg: '#F8FAFC'
        }
      }
    },
  },
  plugins: [],
}
