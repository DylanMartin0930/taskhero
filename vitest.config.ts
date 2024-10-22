import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "__tests__/setup.ts",
    reporters: ["verbose"],
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
