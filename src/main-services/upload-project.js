const unzipper = require("unzipper")

const fs = require("fs")

const path = require("path")

const { dialog } = require("electron")

const { promisify } = require("util")

const { app } = require("electron")
const mv = require("mv")

const mkdirAsync = promisify(fs.mkdir)

const existsAsync = promisify(fs.exists)

const unlinkAsync = promisify(fs.unlink)

const isDev = process.env.IS_DEV == "true" ? true : false

const appPath = isDev ? app.getAppPath() : path.dirname(app.getPath("exe"))

module.exports = async () => {
  const userChosenPath = await dialog.showOpenDialog({
    filters: [
      {
        name: "Zip",
        extensions: ["zip"],
      },
    ],
  })

  if (userChosenPath.filePaths.length > 0) {
    const filePath = userChosenPath.filePaths[0]

    const fileName = path.basename(filePath)

    const fileExtension = path.extname(fileName)

    const fileNameWithoutExtension = path.basename(fileName, fileExtension).replaceAll(" ", "")

    const storagePath = path.join(
      appPath,
      "public",
      "projects",
      fileNameWithoutExtension,
      "storage"
    )

    const outputPath = path.join(appPath, "public", "projects", fileNameWithoutExtension, "output")

    await mkdirAsync(outputPath, {
      recursive: true
    })

    await new Promise((resolve) => {
      fs.createReadStream(filePath)
        .pipe(unzipper.Extract({ path: storagePath }))
        .promise()
        .then((r) => resolve())
    })

    if (await existsAsync(path.resolve(storagePath, fileNameWithoutExtension))) {
      await new Promise((resolve) => {
        mv(path.resolve(storagePath, fileNameWithoutExtension), storagePath, {mkdirp: true}, function(err) {
          resolve()
        });

      })
      
      await unlinkAsync(path.resolve(storagePath, fileNameWithoutExtension))
    }

    return {
      hasError: false,
    }
  }

  return {
    hasError: true,
  }
}
