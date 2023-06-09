import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#303436",
          200: "#404348",
        },
        secondary: {
          100: "#D3E8E7",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
