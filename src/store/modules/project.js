import { reactive } from "vue"
import * as monaco from "monaco-editor"
import {
  FILE_BROWSER_FILES_KEY,
  FILE_BROWSER_FOLDERS_KEY,
  PATH_SEPARATOR,
} from "../../constants"

import { ipcRenderer } from "electron"

const getDefaultStates = () => {
  return reactive({
    projects: new Map(),
    currentProject: reactive({
      storage: {
        [FILE_BROWSER_FOLDERS_KEY]: [
          {
            [FILE_BROWSER_FILES_KEY]: ["ywtf.abc", "latex.tex", "wtf.man"],
            [FILE_BROWSER_FOLDERS_KEY]: [
              {
                [FILE_BROWSER_FILES_KEY]: ["nothing.tex", "wtf.man"],
                [FILE_BROWSER_FOLDERS_KEY]: [
                  {
                    [FILE_BROWSER_FILES_KEY]: [],
                    [FILE_BROWSER_FOLDERS_KEY]: [],
                    name: "abc",
                  },
                ],
                name: "fkthishitimout",
              },
            ],
            name: "hello",
          },
        ],
        [FILE_BROWSER_FILES_KEY]: [],
      },
      name: "project-a",
    }),
    currentFile: null,
  })
}

export default {
  namespaced: true,
  state: () => getDefaultStates(),
  getters: {},
  actions: {
    async openFile({ rootState, dispatch }, path) {
      const content = await ipcRenderer.invoke("open-file", path)
      const joinedPath = path.join(PATH_SEPARATOR)

      if (rootState.editor.currentFilePath !== joinedPath) {
        rootState.editor.saveState(rootState.editor.currentFilePath)

        const editorState = rootState.editor.states.get(joinedPath)

        if (editorState) {
          rootState.editor.updateEditorState(editorState)
        }
      }

      dispatch("editor/updateCurrentFilePath", joinedPath, {
        root: true,
      })
      dispatch("editor/updateEditorContent", content, {
        root: true,
      })
      dispatch(
        "editor/saveContent",
        {
          path: joinedPath,
          editorContent: content,
        },
        {
          root: true,
        }
      )
    },
  },
  mutations: {},
}
