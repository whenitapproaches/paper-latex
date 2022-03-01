const { promisify } = require("util")

const { app } = require("electron")

const systemPath = require("path")

const isDev = process.env.IS_DEV == "true" ? true : false

const appPath = isDev ? app.getAppPath() : systemPath.dirname(app.getPath("exe"))

const PROJECTS_PATH = [appPath, "public", "projects"]

const fs = require("fs")

const FILE_BROWSER_FILES_KEY = "/files"

const FILE_BROWSER_FOLDERS_KEY = "/folders"

const STORAGE_PROJECT_FOLDER_NAME = "storage"

const { promises: { readdir } } = require('fs')

const readDirAsync = promisify(fs.readdir)

const getDirectories = async source =>
  (await readdir(source, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

module.exports = async () => {
  const projects = await getDirectories(systemPath.join(...PROJECTS_PATH))

  const projectsFileTrees = []

  const prs = projects.map((project) => {
    return new Promise(async (resolve) => {
      const storage = await getProjectFileTree(project)
      projectsFileTrees.push({ storage, name: project })
      resolve()
    })
  })

  await Promise.allSettled(prs)

  return projectsFileTrees
}

const getProjectFileTree = (projectName) => {
  return getFolderDetail(
    systemPath.join(
      ...[...PROJECTS_PATH, projectName, STORAGE_PROJECT_FOLDER_NAME]
    ),
    projectName
  )
}

const getFolderDetail = async (path, folderName) => {
  const entries = await readDirAsync(path, { withFileTypes: true })

  const files = entries.filter((file) => !file.isDirectory()).map((o) => o.name)

  const folders = entries
    .filter((folder) => folder.isDirectory() && folder.name !== '__MACOSX')
    .map((o) => o.name)

  const subFolders = []

  const prs = folders.map((folder) => {
    return new Promise(async (resolve) => {
      const sf = await getFolderDetail(systemPath.join(path, folder), folder)
      subFolders.push(sf)
      resolve()
    })
  })

  await Promise.allSettled(prs)

  return {
    [FILE_BROWSER_FILES_KEY]: files,
    [FILE_BROWSER_FOLDERS_KEY]: subFolders,
    name: folderName,
  }
}
