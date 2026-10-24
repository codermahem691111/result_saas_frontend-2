module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12263a",
        slate: { 50: "#f3f5f8" },
        brand: { DEFAULT: "#1b6ca8", dark: "#14527f", soft: "#e3eef7" },
        chalk: "#fbfcfd",
      },
      fontFamily: { sans: ["var(--font-sans)", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
};
