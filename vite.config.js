import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base:'/word-ladder-game/'
  plugins: [react()],
});
