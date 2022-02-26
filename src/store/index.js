import { reactive } from "vue"
import { createStore } from "vuex"
import { DARK_THEME, LIGHT_THEME, DEFAULT_COLOR_SCHEME } from "../constants"
import preview from "./modules/preview"
import editor from "./modules/editor"
import project from "./modules/project"
import messagePopup from "./modules/message-popup"

const getDefaultSettings = () => {
  return reactive({
    theme: DARK_THEME,
    colorScheme: DEFAULT_COLOR_SCHEME,
  })
}

export default createStore({
  state: {
    settings: getDefaultSettings(),
  },
  actions: {
    toggleTheme({ commit, state, dispatch }) {
      const theme =
        state.settings.theme === DARK_THEME ? LIGHT_THEME : DARK_THEME

      dispatch("editor/changeTheme", theme)

      commit("updateSettings", {
        theme,
      })
    },
    updateColorScheme({ commit }, colorScheme) {
      commit("updateColorScheme", colorScheme)
    },
  },
  mutations: {
    updateSettings(state, settings) {
      for (let key in settings) {
        state.settings[key] = settings[key]
      }
    },
    updateColorScheme(state, colorScheme) {
      state.settings.colorScheme = colorScheme
    },
  },
  modules: {
    preview,
    editor,
    project,
    "message-popup": messagePopup,
  },
})
