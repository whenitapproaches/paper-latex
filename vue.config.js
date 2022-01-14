module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        files: ["**/*"],
        extraFiles: [
          {
            from: "public/bin",
            to: "bin",
            filter: ["**/*"],
          },
        ],
      },
    },
    i18n: {
      locale: "en",
      fallbackLocale: "vi",
      localeDir: "locales",
      enableLegacy: false,
      runtimeOnly: false,
      compositionOnly: false,
      fullInstall: true,
    },
  },
}
