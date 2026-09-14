import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base palette
        obsidian: "#0A0A0A",
        charcoal: "#111111",
        "charcoal-light": "#1A1A1A",
        "charcoal-mid": "#222222",
        smoke: "#2A2A2A",
        ash: "#3A3A3A",
        // Accent — dark red per brand swatch (#950606)
        ember: "#950606",
        "ember-light": "#B91C1C",
        "ember-dark": "#5C0303",
        amber: "#D35400",
        // Text
        ivory: "#F5F0EB",
        cream: "#E8E0D5",
        muted: "#888888",
        faint: "#555555",
      },
      fontFamily: {
        serif: ["'Times New Roman'", "Times", "serif"],
        sans: ["'Times New Roman'", "Times", "serif"],
        display: ["'Times New Roman'", "Times", "serif"],
      },
      fontSize: {
        "2xs": ["0.65rem", { lineHeight: "1rem" }],
        "display-sm": ["3.5rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-md": ["5rem", { lineHeight: "1", letterSpacing: "-0.03em" }],
        "display-lg": ["7rem", { lineHeight: "0.95", letterSpacing: "-0.04em" }],
        "display-xl": ["10rem", { lineHeight: "0.9", letterSpacing: "-0.05em" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "88": "22rem",
        "100": "25rem",
        "128": "32rem",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease forwards",
        "slide-up": "slideUp 0.7s ease forwards",
        "slide-down": "slideDown 0.4s ease forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          from: { opacity: "0", transform: "translateY(-10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "noise": "url('/noise.png')",
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
