/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "deep-space": "#0A0A0A",
        "electric-blue": "#00F5FF",
        "cyber-purple": "#6C00FF",
        "holo-white": "#F0F4FF",
        "plasma-pink": "#FF006E",
        "bg-dark": "rgba(29, 32, 41, 1)",
      },
      fontFamily: {
        "space-grotesk": ["Space Grotesk", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        "ibm-plex": ["IBM Plex Sans", "sans-serif"],
      },
      fontSize: {
        h1: ["48px", "1.2"],
        h2: ["32px", "1.3"],
        h3: ["24px", "1.4"],
        body: ["16px", "1.5"],
        micro: ["12px", "1.5"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
