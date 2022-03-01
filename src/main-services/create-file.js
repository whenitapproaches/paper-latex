const fs = require("fs")

const { promisify } = require("util")

const existsAsync = promisify(fs.exists)

const writeFileAsync = promisify(fs.writeFile)

const path = require('path')

const { app } = require("electron")

const isDev = process.env.IS_DEV == "true" ? true : false

const appPath = isDev ? app.getAppPath() : path.dirname(app.getPath("exe"))

console.log(appPath);

module.exports = async ({ project, fileName }) => {
  const filePath = path.join(appPath, "public", "projects", project, "storage", fileName)

  if (await existsAsync(filePath)) {
    return {
      hasError: true,
      error: "file_name_exists",
    }
  }

  await writeFileAsync(filePath, "")

  return {
    hasError: false,
  }
}
