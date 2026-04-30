import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const devApiProxy = process.env.VITE_DEV_API_PROXY ?? "http://localhost:8000";
const devWsProxy = process.env.VITE_DEV_WS_PROXY ?? devApiProxy.replace(/^http/, "ws");

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": { target: devApiProxy, changeOrigin: true },
      "/ws": { target: devWsProxy, ws: true },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/tests/setup.ts"],
    css: true,
  },
});
