import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "~bootstrap": "./node_modules/bootstrap",
      "@host": "https://localhost:5000",
    },
    server: {
      port: 3000,
      hot: true,
    },
  },
});
