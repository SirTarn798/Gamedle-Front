import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        mainTheme : "#232121",
        borderColor : "#B4CAE5",
        secondaryColor : "#E254FF",
        acceptGreen : "#84EA65",
        cancelRed : "#E95050"
      },
      fontFamily: {
        jersey: ["Jersey 10", "cursive"], // Ensure it's correctly formatted
        poppins: ["Poppins", "sans-serif"],
      },
      textShadow: {
        sm: '1px 1px 2px rgba(226, 84, 255, 1)',
        md: '2px 2px 4px rgba(226, 84, 255, 1)',
        lg: '3px 3px 6px rgba(226, 84, 255, 1)',
        nm: '2px 2px 4px rgba(41, 40, 40, 0)',
      },
    },
  },
  plugins: [
    require('tailwindcss-textshadow')
  ],
} satisfies Config;
