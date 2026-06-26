import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmos: {
          bg: "#050510",
          surface: "#0a0a1f",
          elevated: "#0f0f2e",
          accent: "#64ffda",
          glow: "#7b2fff",
          text: "#FFFFFF",
          muted: "#8892b0",
          border: "rgba(100,255,218,0.12)",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        input: "8px",
      },
      animation: {
        "breathe": "breathe 3s ease-in-out infinite",
        "drift": "drift 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "typewriter": "typewriter 0.05s steps(1) forwards",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.7" },
          "50%": { transform: "scale(1.08)", opacity: "1" },
        },
        drift: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 8px rgba(100,255,218,0.3)" },
          "50%": { boxShadow: "0 0 24px rgba(100,255,218,0.7), 0 0 48px rgba(123,47,255,0.3)" },
        },
      },
      boxShadow: {
        "glow-accent": "0 0 24px rgba(100,255,218,0.35), 0 4px 12px rgba(100,255,218,0.2)",
        "glow-purple": "0 0 24px rgba(123,47,255,0.35), 0 4px 12px rgba(123,47,255,0.2)",
        "card": "0 2px 8px rgba(5,5,16,0.5), 0 8px 32px rgba(5,5,16,0.4), 0 0 0 1px rgba(100,255,218,0.08)",
        "card-hover": "0 4px 16px rgba(100,255,218,0.15), 0 16px 48px rgba(5,5,16,0.6), 0 0 0 1px rgba(100,255,218,0.2)",
      },
      backdropBlur: {
        xs: "4px",
      },
    },
  },
  plugins: [],
};
export default config;
