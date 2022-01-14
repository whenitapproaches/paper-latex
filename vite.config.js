import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import electron from "vitejs-plugin-electron"

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.ELECTRON == "true" ? "./" : ".",
  plugins: [vue(), electron()],
  define: {
    "process.env": process.env,
  },
  root: __dirname,
  build: {
    // Required, correct module resolve after build.
    // Vite will generate multiple files after build, and then index.html with './' relative path load module, instead of the default 'assets' folder.
    assetsDir: "",
    rollupOptions: {
      output: {
        // Required, Electron only supports CommonJs module.
        format: "cjs",
      },
      // Required, 'electron.externals' includes 'electron' and NodeJs builtin modules.
      external: [...electron.externals],
    },
    outDir: "/dist",
    emptyOutDir: true,
  },
  optimizeDeps: {
    // Optional.
    exclude: ["electron"],
  },
})
