import { reactive } from "vue"
import * as monaco from "monaco-editor"

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
  },
  mutations: {
    updateEditor(state, editor) {
      state.editor = editor
    },
    updateState(state, { path, editorState }) {
      const states = state.states

      states.set(path, editorState)

      state.states = states
      console.log(state.states)
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
