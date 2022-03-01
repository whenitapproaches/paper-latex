import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
// import electron from "vitejs-plugin-electron"
import vueI18n from "@intlify/vite-plugin-vue-i18n"
import path from "path"

import fastExternal from "vite-plugin-fast-external"

import copy from "rollup-plugin-copy"

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.ELECTRON == "true" ? "./" : ".",
  plugins: [
    vue(),
    // electron(),
    vueI18n({
      // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
      // compositionOnly: false,

      // you need to set i18n resource including paths !
      include: path.resolve(__dirname, "./src/locales/**"),
    }),
    fastExternal({
      // Simple example
      // vue: "Vue",

      // Electron Renderer-process
      electron: () =>
        `const { ipcRenderer } = require('electron'); export { ipcRenderer }`,
    }),
  ],
  define: {
    "process.env": process.env,
  },
  root: __dirname,
  // base: "./",
  build: {
    rollupOptions: {
      plugins: [
        // copy({
        //   targets: [
        //     {
        //       src: "public",
        //       dest: "",
        //     },
        //   ],
        //   hook: "writeBundle",
        // }),
      ],
    },
    //   assetsDir: "",
    //   rollupOptions: {
    //     output: {
    //       // Required, Electron only supports CommonJs module.
    //       format: "cjs",
    //     },
    //     // Required, 'electron.externals' includes 'electron' and NodeJs builtin modules.
    //     external: [
    //       // ...electron.externals,
    //       // "vue",
    //       // "@vue",
    //       // "@vue/reactivity",
    //       // "vuex",
    //       // "vue-router",
    //       // "vue-i18n",
    //       // "@vue/runtime-core",
    //       // "tailwindcss",
    //       // "onigasm",
    //       // "monaco-editor",
    //       // "monaco-editor-textmate",
    //       // "monaco-textmate",
    //       // "lodash",
    //       // "axios",
    //     ],
    //   },
  },
  // optimizeDeps: {
  //   // Optional.
  //   // exclude: ["electron"],
  // },
})
