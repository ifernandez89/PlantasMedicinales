import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── Paleta herbarium emocional ──────────────────────────────
      colors: {
        // Base cálida (hueso / crema)
        hueso: {
          50:  "#fdfaf5",
          100: "#f7f0e3",
          200: "#ede0c8",
          300: "#ddc9a8",
          400: "#c9ae86",
          500: "#b59468",
        },
        // Verde salvia (natural / medicinal)
        salvia: {
          50:  "#f3f5ef",
          100: "#e4e9db",
          200: "#c8d4b8",
          300: "#a6b990",
          400: "#849e6b",
          500: "#637d4d",
          600: "#4e6439",
          700: "#3c4e2c",
          800: "#2c3920",
          900: "#1e2716",
        },
        // Rosa pálido (vida / floración)
        petal: {
          50:  "#fdf5f5",
          100: "#fae8e8",
          200: "#f4d0d0",
          300: "#ebb0b0",
          400: "#dc8888",
          500: "#c96666",
        },
        // Lavanda suave (transición)
        lavanda: {
          50:  "#f5f3f9",
          100: "#ece8f4",
          200: "#dcd4ec",
          300: "#c3b8de",
          400: "#a697cc",
          500: "#8b7bb8",
        },
        // Gris humo (marchitez / tiempo)
        humo: {
          50:  "#f4f4f2",
          100: "#e8e8e4",
          200: "#d2d2cc",
          300: "#b4b4ac",
          400: "#8c8c84",
          500: "#6a6a62",
          600: "#505048",
          700: "#3c3c36",
          800: "#282824",
          900: "#181814",
        },
      },

      // ─── Tipografía editorial ────────────────────────────────────
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        body:    ["var(--font-jost)", "system-ui", "sans-serif"],
        mono:    ["var(--font-mono)", "monospace"],
      },

      // ─── Animaciones orgánicas ───────────────────────────────────
      keyframes: {
        "breath": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%":       { transform: "scale(1.012)", opacity: "0.92" },
        },
        "bloom": {
          "0%":   { transform: "scale(0.96) translateY(6px)", opacity: "0" },
          "100%": { transform: "scale(1) translateY(0)",      opacity: "1" },
        },
        "wilt": {
          "0%":   { filter: "saturate(1) brightness(1)",   transform: "translateY(0)" },
          "100%": { filter: "saturate(0.4) brightness(0.85)", transform: "translateY(2px)" },
        },
        "fog-in": {
          "0%":   { opacity: "0", filter: "blur(8px)" },
          "100%": { opacity: "1", filter: "blur(0px)" },
        },
        "grain-shift": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-1%, -1%)" },
          "20%": { transform: "translate(1%, 1%)" },
          "30%": { transform: "translate(-1%, 1%)" },
          "40%": { transform: "translate(1%, -1%)" },
          "50%": { transform: "translate(-0.5%, 0.5%)" },
          "60%": { transform: "translate(0.5%, -0.5%)" },
          "70%": { transform: "translate(-0.5%, -0.5%)" },
          "80%": { transform: "translate(0.5%, 0.5%)" },
          "90%": { transform: "translate(-1%, 0)" },
        },
      },
      animation: {
        "breath":     "breath 4s ease-in-out infinite",
        "bloom":      "bloom 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "wilt":       "wilt 0.5s ease-out forwards",
        "fog-in":     "fog-in 1.2s ease-out forwards",
        "grain":      "grain-shift 0.4s steps(1) infinite",
      },

      // ─── Blur personalizado ──────────────────────────────────────
      blur: {
        xs: "2px",
      },

      // ─── Durations más lentas ────────────────────────────────────
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
      },
    },
  },
  plugins: [],
};

export default config;
