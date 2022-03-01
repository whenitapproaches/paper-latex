import { MESSAGE_POPUP_DEFAULT_TIME } from "../../constants"

const getDefaultState = () => ({
  isActive: false,
  content: "",
  timeout: null,
})

export default {
  namespaced: true,
  state: () => getDefaultState(),
  getters: {},
  actions: {
    popUp(
      { state, dispatch },
      { content, time } = { content: "", time: MESSAGE_POPUP_DEFAULT_TIME }
    ) {
      if (state.isActive) return

      state.content = content
      state.isActive = true

      state.timeout = setTimeout(() => dispatch("hide"), time)
    },
    hide({ state }) {
      state.isActive = false
      clearTimeout(state.timeout)
    },
  },
  mutations: {},
}
