/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',  // <--- biar bisa toggle dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
