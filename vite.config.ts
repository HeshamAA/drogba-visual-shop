import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean
  ),
  resolve: {
    alias: [
      {
        find: "@/components",
        replacement: path.resolve(__dirname, "./src/shared/components"),
      },
      {
        find: "@/hooks",
        replacement: path.resolve(__dirname, "./src/shared/hooks"),
      },
      {
        find: "@/i18n",
        replacement: path.resolve(__dirname, "./src/shared/i18n"),
      },
      {
        find: "@/lib",
        replacement: path.resolve(__dirname, "./src/lib"),
      },
      {
        find: "@/shared",
        replacement: path.resolve(__dirname, "./src/shared"),
      },
      {
        find: "@/features",
        replacement: path.resolve(__dirname, "./src/features"),
      },
      {
        find: "@/api",
        replacement: path.resolve(__dirname, "./src/api"),
      },
      {
        find: "@/contexts",
        replacement: path.resolve(__dirname, "./src/contexts"),
      },
      {
        find: "@",
        replacement: path.resolve(__dirname, "./src"),
      },
    ],
  },
}));
