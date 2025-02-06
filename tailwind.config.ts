import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "main": "#ffffff",
        "primary": "#e8e8e8",
        "secondary": "#d1d1d1",
        "bluey": "#4d6eff",
        "greyy": "#7b92b2",
        "grayy": "#7b92b2",
        "greeny": "#67cba0",
        "blacky": "#181a2a",
      }
    },
  },
  plugins: [],
};
export default config;
