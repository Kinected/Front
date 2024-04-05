import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        switchPages: {
          "0%, 100%": { top: "-100%" },
          "50%": { top: "0%" },
        },
      },
      animation: {
        switchPages: "switchPages 2s ease-in-out",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      transitionTimingFunction: {
        "elastic": "cubic-bezier(0,1.75,.45,1)",
        DEFAULT: "cubic-bezier(0,1.75,.45,1)",
      },
    },
  },
  plugins: [],
};
export default config;