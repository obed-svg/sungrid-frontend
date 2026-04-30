import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            50: "#F1F9FE",
            100: "#E2F3FC",
            200: "#BEE6F9",
            300: "#85D2F4",
            400: "#44BCEC",
            500: "#1BA4DC",
            600: "#0E85BD",
            700: "#0D6997",
            800: "#0F597D",
            900: "#124A68",
            950: "#0C2F45",
          },
        },
        status: {
          closed: "#16a34a",
          open: "#dc2626",
          error: "#ca8a04",
          offline: "#64748b"
        }
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Menlo", "monospace"]
      }
    }
  },
  plugins: []
} satisfies Config;
