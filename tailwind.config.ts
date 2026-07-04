import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#06070F",
        surface: "#0C0F1D",
        "surface-2": "#12162A",
        signal: "#7B96FF",
        ion: "#A56BFF",
        vapor: "#E9EBF5",
        ash: "#868DA6",
        // shadcn token bridge so `bg-primary` etc. resolve to the signal color
        primary: "#7B96FF",
        border: "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(100%)" },
        },
        marquee: { to: { transform: "translateX(-50%)" } },
      },
      animation: {
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        marquee: "marquee 26s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
