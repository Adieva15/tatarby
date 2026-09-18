/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eef7f0",
          100: "#d6ebda",
          500: "#2f8f4a",
          600: "#25743b",
          700: "#1c5a2e",
        },
        accent: {
          DEFAULT: "#c8102e",
          dark: "#9b0c22",
          light: "#e63946",
        },
        gold: {
          DEFAULT: "#e0b341",
          light: "#f0d585",
          dark: "#b88d1f",
        },
        cream: "#f3e5c1",
      },
      fontFamily: {
        sans: ['"Inter"', "system-ui", "sans-serif"],
        serif: ['"Playfair Display"', "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};