const fs = require("fs")

const systemPath = require("path")

const { app } = require("electron")

const isDev = process.env.IS_DEV == "true" ? true : false

const appPath = isDev ? app.getAppPath() : systemPath.dirname(app.getPath("exe"))

const PROJECTS_PATH = [appPath, "public", "projects"]

const { promisify } = require("util")

const writeFileAsync = promisify(fs.writeFile)

module.exports = async ({ path, content }) => {
  const filePath = systemPath.join(...PROJECTS_PATH, ...path)

  await writeFileAsync(filePath, content)
}
