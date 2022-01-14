import { EMPTY_PDF_URL } from "../../constants"

const getDefaultState = () => ({
  pdfFileUrl: EMPTY_PDF_URL,
})

export default {
  namespaced: true,
  state: () => getDefaultState(),
  getters: {},
  actions: {},
  mutations: {},
}
