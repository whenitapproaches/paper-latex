module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      files: ["dist"],
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
