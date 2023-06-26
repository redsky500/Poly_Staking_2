/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "486px",
      },
      colors: {
        // Previous Color
        basecolor: "#04E09F",
        baseback: "#03010F",
        secondback: "#03191E",

        // new Color
        themeColorRight: "#247BA0",
        themeColorLeft: "#FFFFB5",
        countdownBG: "#313b3f",
        countdownColor: "#d9a74a",
      },
      width: {
        public: "707px",
      },
      fontFamily: {
        Rubik: ["Rubik Wet Paint", "cursive"],
       },
    },
  },
  plugins: [],
};
