const { dialog } = require("electron")

const LATEX_OCR_DIRECTORY = "latex-ocr-main"

const LATEX_OCR_PREDICT_FILE = "pix2tex.py"

const path = require("path")

const fs = require("fs")

const { app } = require("electron")

const isDev = process.env.IS_DEV == "true" ? true : false

const appPath = isDev ? app.getAppPath() : path.dirname(app.getPath("exe"))

const predictCommands = [
  "py",
  path.join(appPath, "public", LATEX_OCR_DIRECTORY, LATEX_OCR_PREDICT_FILE),
]

const getPredictCommandsWithFile = (fileName) => {
  return predictCommands.join(" ") + ` -f ${fileName}`
}

const { exec } = require("child_process")

const { promisify } = require("util")

const { performance } = require("perf_hooks")
const { nanoid } = require("nanoid")

const execAsync = promisify(exec)

const writeFileAsync = promisify(fs.writeFile)

const unlinkAsync = promisify(fs.unlink)

const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

module.exports = async (imageDataUrl) => {
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

          let t1 = performance.now()

          let result

          try {
            result = await execAsync(getPredictCommandsWithFile(filePath))
          } catch (error) {
            return resolve({
              hasError: true,
              duration: performance.now() - t1,
              image: {
                filePath,
                fileName,
                base64: fs.readFileSync(filePath).toString("base64"),
              },
            })
          }

          return resolve({
            result: formatResult(result.stdout),
            hasError: !!result.stderr,
            duration: performance.now() - t1,
            image: {
              filePath,
              fileName,
              base64: fs.readFileSync(filePath).toString("base64"),
            },
          })
        }

        return resolve({
          hasError: true,
        })
      } else {
        let t1 = performance.now()

        let regex = /^data:.+\/(.+);base64,(.*)$/
        let matches = imageDataUrl.match(regex)
        let ext = matches[1]
        let data = matches[2]
        let buffer = Buffer.from(data, "base64")

        const filePath = require("path").resolve(
          appPath,
          `${nanoid(10)}.${ext}`
        )

        await writeFileAsync(filePath, buffer, {
          encoding: "base64",
        })

        let result

        try {
          result = await execAsync(getPredictCommandsWithFile(filePath))
        } catch (error) {
          await unlinkAsync(filePath)

          return resolve({
            hasError: true,
            duration: performance.now() - t1,
            image: {
              filePath,
            },
          })
        }

        await unlinkAsync(filePath)

        return resolve({
          result: formatResult(result.stdout),
          hasError: !!result.stderr,
          duration: performance.now() - t1,
          image: {
            filePath,
          },
        })
      }
    }),
  ])
}

const formatResult = (value) => {
  let b = (c = 0)

  value = value.trim()

  value.split("").forEach((e) => {
    if (e === "{") b++
    if (e === "}") c++
  })

  if (b !== c) return value + "}"

  return value
}
