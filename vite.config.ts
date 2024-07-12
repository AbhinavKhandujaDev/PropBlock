import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  root: "./",
  plugins: [react()],
  server: {
    port: 3001,
  },
  //   resolve: {
  //     alias: {
  //       src: "/src",
  //       icons: "/src/assets/icons",
  //       components: "/src/components",
  //       hooks: "/src/hooks",
  //       api: "/src/api",
  //     },
  //   },
});
