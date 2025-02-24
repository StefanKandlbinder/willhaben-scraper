module.exports = {
  content: ["./public/index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  important: true,
  theme: {
    extend: {
      colors: {
        primary: "rgba(67, 170, 139)",
      },
      minWidth: {
        12: "3rem",
        14: "3.5rem",
      },
      minHeight: {
        12: "3rem",
        14: "3.5rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
