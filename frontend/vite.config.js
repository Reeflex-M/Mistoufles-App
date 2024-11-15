import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import postcssImport from "postcss-import";
import tailwindcss from "tailwindcss";
import autoprefixer from "autoprefixer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Permet l'accès depuis le réseau
  },
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
    postcss: {
      plugins: [postcssImport(), tailwindcss(), autoprefixer()],
    },
  },
});
