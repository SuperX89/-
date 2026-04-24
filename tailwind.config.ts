import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Primary — warm teal (not too mint, not too cold)
        brand: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        // Accent — warm peach for kids feel
        peach: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
        },
        blush: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          500: "#ec4899",
        },
        // Canvas — warm cream, not cold gray
        canvas: "#FBF8F2",
        card: "#ffffff",
        ink: {
          900: "#0F1419",
          800: "#1C2127",
          700: "#374151",
          600: "#4B5563",
          500: "#6B7280",
          400: "#9CA3AF",
          300: "#D1D5DB",
          200: "#E5E7EB",
          100: "#F3F4F6",
          50: "#F9FAFB",
        },
      },
      boxShadow: {
        soft: "0 1px 2px 0 rgb(15 20 25 / 0.04), 0 1px 3px 0 rgb(15 20 25 / 0.04)",
        card: "0 1px 2px 0 rgb(15 20 25 / 0.03), 0 4px 16px -4px rgb(15 20 25 / 0.06)",
        lift: "0 4px 24px -8px rgb(15 20 25 / 0.12)",
        brand: "0 6px 20px -8px rgb(16 185 129 / 0.4)",
        peach: "0 6px 20px -8px rgb(249 115 22 / 0.35)",
        inner: "inset 0 1px 2px rgb(15 20 25 / 0.04)",
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "var(--font-display)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        display: [
          "var(--font-display)",
          "var(--font-sans)",
          "ui-sans-serif",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Noto Color Emoji",
        ],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
        "3xl": "1.5rem",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
        "peach-gradient": "linear-gradient(135deg, #fb923c 0%, #f97316 100%)",
        "hero-blur": "radial-gradient(circle at 15% 0%, rgba(16,185,129,0.12), transparent 50%), radial-gradient(circle at 85% 10%, rgba(249,115,22,0.10), transparent 55%)",
      },
    },
  },
  plugins: [],
} satisfies Config;
