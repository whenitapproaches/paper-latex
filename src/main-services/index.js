const fs = require("fs")
const systemPath = require("path")
const { promisify } = require("util")

const readFileAsync = promisify(fs.readFile)

const projectsToFileTree = require("./projects-to-file-trees")

const insertMath = require("./insert-math")

const insertImage = require("./insert-image")

const compileLatex = require("./compile-latex")

const saveFile = require("./save-file")

const createFile = require("./create-file")

const uploadProject = require("./upload-project")

const downloadProject = require("./download-project")

const createProject = require("./create-project")
const { app } = require("electron")
const path = require("path")

const isDev = process.env.IS_DEV == "true" ? true : false

const appPath = isDev ? "" : path.dirname(app.getPath("exe"))

module.exports = {
  getFileContent: (path) => {
    const BASE_PATH = [appPath, "public", "projects"]

    const joinedPath = systemPath.join(...[...BASE_PATH, ...path])

    return readFileAsync(joinedPath, { encoding: "utf-8" })
  },
  getProjectsTree: () => {
    return projectsToFileTree()
  },
  insertMath,
  compileLatex,
  saveFile,
  insertImage,
  createFile,
  uploadProject,
  downloadProject,
  createProject,
}

// const getFileContent = async (path) => {
//   const BASE_PATH = ["public", "projects"]

//   const joinedPath = systemPath.join(...[...BASE_PATH, ...path])

//   console.log(joinedPath)

//   const p = "public\\projects\\project-a\\storage\\hello\\wtf.man"

//   const fileContent = await readFileAsync(p, { encoding: "utf-8" })

//   console.log(fileContent)
// }

// getFileContent("")
