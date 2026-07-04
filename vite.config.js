import { defineConfig } from "vite";

export default defineConfig({
  esbuild: {
    jsx: "transform",
    jsxFactory: "MyReact.createElement",
    jsxFragment: "MyReact.Fragment",
  },
});
