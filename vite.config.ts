import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    port: 5173,
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
    },
  },
});
