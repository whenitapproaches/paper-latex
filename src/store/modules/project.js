import { reactive } from "vue"
import {
  FILE_BROWSER_FILES_KEY,
  FILE_BROWSER_FOLDERS_KEY,
  PATH_SEPARATOR,
  PROJECT_STORAGE_FOLDER_NAME,
  MAIN_LATEX_ENTRY,
} from "../../constants"

import { ipcRenderer } from "electron"

import createFile from "../../services/createFile"
import createProject from "../../services/createProject"
import uploadProject from "../../services/uploadProject"

const getDefaultStates = () => {
  return reactive({
    projects: [],
    currentProject: reactive({
      storage: {
        [FILE_BROWSER_FOLDERS_KEY]: [],
        [FILE_BROWSER_FILES_KEY]: [],
      },
      name: "",
      entryPath: null,
    }),
    currentFilePath: [],
  })
}

export default {
  namespaced: true,
  state: () => getDefaultStates(),
  getters: {
    currentProjectMainEntryFilePath: (state) => {
      const currentProject = state.currentProject

      if (!currentProject) return null

      if (currentProject.entryPath) return currentProject.entryPath

      if (
        !currentProject.storage[FILE_BROWSER_FILES_KEY].includes(
          MAIN_LATEX_ENTRY
        )
      )
        return null

      const defaultEntryPath = [
        currentProject.name,
        PROJECT_STORAGE_FOLDER_NAME,
        MAIN_LATEX_ENTRY,
      ]

      currentProject.entryPath = defaultEntryPath

      return defaultEntryPath
    },
  },
  actions: {
    async openFile({ rootState, dispatch, state }, path) {
      const content = await ipcRenderer.invoke("open-file", path)
      const joinedPath = path.join(PATH_SEPARATOR)

      if (rootState.editor.currentFilePath !== joinedPath) {
        rootState.editor.saveState(rootState.editor.currentFilePath)
      }

      dispatch("editor/updateEditorContent", content, {
        root: true,
      })

      const editorState = rootState.editor.states.get(joinedPath)

      if (editorState) {
        rootState.editor.updateEditorState(editorState)
      }

      dispatch("editor/updateCurrentFilePath", joinedPath, {
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

      state.currentFilePath = path
    },
    updateProjects({ commit }, projectFileTrees) {
      commit("updateProjects", projectFileTrees)
    },
    updateCurrentProject({ state }, project) {
      state.currentProject = project
    },
    updateCurrentProjectEntryPath({ state }, path) {
      state.currentProject.entryPath = path
    },
    createFile({}, { project, fileName }) {
      return createFile({ project, fileName })
    },
    createProject({}, projectName) {
      return createProject(projectName)
    },
    uploadProject() {
      return uploadProject()
    },
  },
  mutations: {
    updateProjects(state, projectFileTrees) {
      state.projects = projectFileTrees
      const currentProjectName = state.currentProject?.name

      if (!currentProjectName) return

      state.currentProject = projectFileTrees.find(
        (o) => o.name === currentProjectName
      )
    },
  },
}
