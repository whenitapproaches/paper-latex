const unzipper = require("unzipper")

const fs = require("fs")

const path = require("path")

const { dialog } = require("electron")

const { app } = require("electron")

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

    const fileNameWithoutExtension = path.basename(fileName, fileExtension)

    const outputPath = path.join(
      appPath,
      "public",
      "projects",
      fileNameWithoutExtension,
      "storage"
    )

    await new Promise((resolve) => {
      fs.createReadStream(filePath)
        .pipe(unzipper.Extract({ path: outputPath }))
        .promise()
        .then((r) => resolve())
    })

    return {
      hasError: false,
    }
  }

  return {
    hasError: true,
  }
}
