/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      inter: ["Inter", '"sans serif"'],
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
