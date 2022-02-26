import { reactive } from "vue"
import {
  EMPTY_PDF_URL,
  COMPILING_LOG_VIEWING_STATE,
  RESULT_LOG_VIEWING_STATE,
} from "../../constants"

const getDefaultState = () => ({
  pdfFileUrl: EMPTY_PDF_URL,
  latexEngine: reactive({
    isBusy: false,
    engine: null,
  }),
  compileResult: reactive({
    compilingLog: "",
    resultLog: "",
  }),
  viewingLogState: false,
})

export default {
  namespaced: true,
  state: () => getDefaultState(),
  getters: {
    viewingLog(state) {
      switch (state.viewingLogState) {
        case COMPILING_LOG_VIEWING_STATE:
          return state.compileResult.compilingLog
        case RESULT_LOG_VIEWING_STATE:
          return state.compileResult.resultLog
        default:
          break
      }
    },
    isViewingLog(state) {
      return [COMPILING_LOG_VIEWING_STATE, RESULT_LOG_VIEWING_STATE].includes(
        state.viewingLogState
      )
    },
  },
  actions: {
    updatePdfFileUrl({ state }, pdfFileUrl) {
      state.pdfFileUrl = pdfFileUrl
    },
    updateCompilingLog({ state }, compilingLog) {
      state.compileResult.compilingLog = compilingLog
    },
    updateResultLog({ state }, resultLog) {
      state.compileResult.resultLog = resultLog
    },
    updateViewingLogState({ state }, viewingState) {
      state.viewingLogState = viewingState
    },
  },
  mutations: {},
}
