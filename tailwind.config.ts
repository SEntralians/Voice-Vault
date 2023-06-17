import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#568446",
          200: "#05295C",
        },
        secondary: {
          100: "#C3DFAF",
          200: "#89C468"
        },
        background: {
          100: "#F8F5E9",
        }
      },
    },
  },
  plugins: [],
} satisfies Config;
