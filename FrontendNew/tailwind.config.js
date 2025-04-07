/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        themeCyan: "#A2F2EF",
        themeBlue: "#243956",
        themeRed: "#FECCCC",
        themeLightGray: "#F2F3F5",
        themeDarkGray: "#F5F5F5",
      },
    },
  },
  plugins: [],
};
