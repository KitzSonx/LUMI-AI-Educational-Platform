/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ais: {
          green: "#70b22a",
          dark: "#0f172a",
          card: "#1e293b",
          border: "#334155"
        }
      }
    },
  },
  plugins: [],
};
