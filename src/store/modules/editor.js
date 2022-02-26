import { reactive } from "vue"
import * as monaco from "monaco-editor"
import insertMath from "../../services/insertMath"
import insertImage from "../../services/insertImage"

const getDefaultStates = () => {
  return reactive({
    updateEditorContent: () => {},
    states: new Map(),
    contents: new Map(),
    cursors: new Map(),
    currentFilePath: "",
    editor: null,
    updateEditorState: () => {},
    setEditorCursorPosition: () => {},
    saveState: () => {},
    isProjectBrowserModalActive: false,
    insertText: () => {},
    wrapText: () => {},
    getCurrentEditorText: () => {},
  })
}

export default {
  namespaced: true,
  state: () => getDefaultStates(),
  actions: {
    changeTheme({}, theme) {
      monaco.editor.setTheme(theme)
    },
    updateEditor({ commit }, editor) {
      commit("updateEditor", editor)
    },
    saveState({ commit }, { path, editorState }) {
      commit("updateState", { path, editorState })
    },
    saveContent({ commit }, { path, editorContent }) {
      commit("updateContent", { path, editorContent })
    },
    saveCursor({ commit }, { path, cursor }) {
      commit("updateCursor", { path, cursor })
    },
    updateCurrentFilePath({ commit }, path) {
      commit("updateCurrentFilePath", path)
    },
    updateEditorContent({ state }, editorContent) {
      state.updateEditorContent(editorContent)
    },
    updateEditorUpdateContentFunction({ state }, callback) {
      state.updateEditorContent = callback
    },
    updateEditorUpdateStateFunction({ state }, callback) {
      state.updateEditorState = callback
    },
    updateEditorSetEditorCursorFunction({ state }, callback) {
      state.setEditorCursorPosition = callback
    },
    updateEditorSaveStateFunction({ state }, callback) {
      state.saveState = callback
    },
    updateEditorInsertTextFunction({ state }, callback) {
      state.insertText = callback
    },
    updateEditorWrapTextFunction({ state }, callback) {
      state.wrapText = callback
    },
    updateIsProjectBrowserModalActive({ state }, value) {
      state.isProjectBrowserModalActive = value
    },
    updateGetCurrentEditorTextFunction({ state }, callback) {
      state.getCurrentEditorText = callback
    },
    async insertMath({ state }, imageDataUrl) {
      return await insertMath(imageDataUrl)
    },
    async insertImage({ state }, { project, imageDataUrl }) {
      return await insertImage({ project, imageDataUrl })
    },
  },
  mutations: {
    updateEditor(state, editor) {
      state.editor = editor
    },
    updateState(state, { path, editorState }) {
      const states = state.states

      states.set(path, editorState)

      state.states = states
    },
    updateContent(state, { path, editorContent }) {
      const contents = state.contents

      contents.set(path, editorContent)

      state.contents = contents
    },
    updateCursor(state, { path, cursor }) {
      const cursors = state.cursors

      cursors.set(path, cursor)

      state.cursors = cursors
    },
    updateCurrentFilePath(state, path) {
      state.currentFilePath = path
    },
  },
}
