const { dialog } = require("electron")

const path = require("path")

const fs = require("fs")

const { exec } = require("child_process")

const { promisify } = require("util")
const { nanoid } = require("nanoid")

const execAsync = promisify(exec)

const writeFileAsync = promisify(fs.writeFile)

const unlinkAsync = promisify(fs.unlink)

const existsAsync = promisify(fs.exists)

const copyFileAsync = promisify(fs.copyFile)

const { app } = require("electron")

const isDev = process.env.IS_DEV == "true" ? true : false

const appPath = isDev ? "" : path.dirname(app.getPath("exe"))

const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

module.exports = async ({ project, imageDataUrl }) => {
  console.log(project)

  return await Promise.race([
    new Promise(async (resolve) => {
      await timeout(60000)
      resolve({
        hasError: true,
      })
    }),
    new Promise(async (resolve) => {
      if (!imageDataUrl) {
        const userChosenPath = await dialog.showOpenDialog({
          filters: [
            {
              name: "Image",
              extensions: ["png", "jpg", "jpeg"],
            },
          ],
        })

        if (userChosenPath.filePaths.length > 0) {
          const filePath = userChosenPath.filePaths[0]

          const fileName = require("path").basename(filePath)

          let saveFilePath = await getSaveFilePath(project, fileName)

          const saveFileExtension = path.extname(saveFilePath)

          const saveFileNameWithoutExtension = path.basename(
            saveFilePath,
            saveFileExtension
          )

          await copyFileAsync(filePath, saveFilePath)

          return resolve({
            hasError: false,
            saveFilePath,
            result: `\\includegraphics[scale=1]\{${saveFileNameWithoutExtension}\}`,
          })
        }
      } else {
        let regex = /^data:.+\/(.+);base64,(.*)$/
        let matches = imageDataUrl.match(regex)
        let ext = matches[1]
        let data = matches[2]
        let buffer = Buffer.from(data, "base64")

        const fileName = nanoid(5) + "." + ext

        let saveFilePath = await getSaveFilePath(project, fileName)

        const saveFileExtension = path.extname(saveFilePath)

        const saveFileNameWithoutExtension = path.basename(
          saveFilePath,
          saveFileExtension
        )

        await writeFileAsync(saveFilePath, buffer)

        return resolve({
          hasError: false,
          saveFilePath,
          result: `\\includegraphics[scale=1]\{${saveFileNameWithoutExtension}\}`,
        })
      }
    }),
  ])
}

const getSaveFilePath = async (project, fileName) => {
  const extension = path.extname(fileName)

  const fileNameWithoutExtension = path.basename(fileName, extension)

  let saveFilePath = path.join(
    appPath,
    "public",
    "projects",
    project,
    "storage",
    fileName
  )

  if (await existsAsync(saveFilePath)) {
    return path.join(
      appPath,
      "public",
      "projects",
      project,
      "storage",
      fileNameWithoutExtension + "_" + nanoid(5) + extension
    )
  }

  return saveFilePath
}
