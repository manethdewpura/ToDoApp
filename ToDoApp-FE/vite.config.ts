import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { configDefaults, defineConfig as defineVitestConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    css: true,
    globals: true,
    exclude: [...configDefaults.exclude, "e2e/**"],
  },
});
