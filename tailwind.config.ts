import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Haraca color palette — maps to CSS variables
        bg:           "var(--color-bg)",
        surface:      "var(--color-surface)",
        "surface-alt":"var(--color-surface-alt)",
        border:       "var(--color-border)",
        accent:       "var(--color-accent)",
        "accent-hover":"var(--color-accent-hover)",
        brown:        "var(--color-brown)",
        "brown-dark": "var(--color-brown-dark)",
        brand:        "var(--color-text)",
        muted:        "var(--color-text-muted)",
        dark:         "var(--color-dark)",
      },
      fontFamily: {
        sans:    ["DM Sans", "sans-serif", "Inter", "Geist"],
        display: ["Cormorant Garamond", "serif"],
      },
      borderRadius: {
        btn:   "var(--radius-btn)",
        card:  "var(--radius-card)",
        input: "var(--radius-input)",
        badge: "var(--radius-badge)",
      },
      maxWidth: {
        content: "var(--content-max-width)",
      },
    },
  },
  plugins: [],
};

export default config;
