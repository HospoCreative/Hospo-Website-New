import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#002C5D",
        navy: "#002C5D",
        cream: "#FFFFFF",
        bone: "#FFFFFF",
        fog: "#FFFFFF",
        wheat: "#FFFFFF",
        yellow: "#FFCC53"
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "Inter", "sans-serif"]
      },
      boxShadow: {
        soft: "0 24px 80px rgba(0, 44, 93, 0.14)",
        editorial: "0 30px 110px rgba(0, 44, 93, 0.22)"
      }
    }
  },
  plugins: []
};

export default config;
