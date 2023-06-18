import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#568446",
          200: "#05295C",
          300: "#C3DFAFFF",
          400: "#ABD28FFF",
        },
        secondary: {
          100: "#C3DFAF",
          200: "#89C468",
        },
        background: {
          100: "#F8F5E9",
        },
        profile: {
          left: "#4069A2FF",
          right: "#CCD22AFF",
        },
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
