import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
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

