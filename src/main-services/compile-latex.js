const fs = require("fs")

const isDev = process.env.IS_DEV == "true" ? true : false

const STORAGE_PROJECT_FOLDER_NAME = "storage"
const OUTPUT_PROJECT_FOLDER_NAME = "output"

const path = require("path")

const { exec } = require("child_process")

const COMPILER_DIRECTORY = ["public", "bin", "texlive", "bin", "win32"]

const COMPILER = "/Library/TeX/texbin/latexmk"

const { app } = require("electron")

const appPath = isDev ? app.getAppPath() : path.dirname(app.getPath("exe"))

const { promisify } = require("util")

const PROJECTS_PATH = [appPath, "public", "projects"]

const readFileAsync = promisify(fs.readFile)

const existsAsync = promisify(fs.exists)

console.log(__dirname, app.getAppPath(), app.getPath("exe"));

process.env.PATH += ":/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Library/TeX/texbin:/Library/Apple/usr/bin"

const execCompileCommand = (projectPath, outputPath) => {
  const compilePath = path.join(appPath, ...COMPILER_DIRECTORY, COMPILER)

  const command = `${COMPILER} -halt-on-error -pdfxe -cd -output-directory=${outputPath} ${projectPath}`

  // fs.writeFileSync(path.resolve(...PROJECTS_PATH, "command.txt"), command);
  // fs.writeFileSync(path.resolve(...PROJECTS_PATH, "env.txt"), JSON.stringify(process.env));

  return exec(command)
}

const getEntryFileName = (entry) => {
  const file = entry[entry.length - 1]

  return path.parse(file).name
}

module.exports = async (payload) => {
  const { project, entry } = payload

  const entryFileName = getEntryFileName(entry)

  const entryPath = path.join(...[...PROJECTS_PATH, ...entry])

  const outputPath = path.join(
    ...[...PROJECTS_PATH, project, OUTPUT_PROJECT_FOLDER_NAME]
  )

  const execProcess = await execCompileCommand(entryPath, outputPath)

  // require('fs').writeFileSync('/Users/nals_macbook_124/result.json', JSON.stringify(execProcess))

  const resultFilePath = path.join(
    ...[...PROJECTS_PATH, project, OUTPUT_PROJECT_FOLDER_NAME],
    `${entryFileName}-result.log`
  )

  await existsAsync(resultFilePath)

  const resultWriteStream = fs.createWriteStream(resultFilePath)

  await new Promise((resolve) => {
    execProcess.stdout.pipe(resultWriteStream)

    execProcess.on("close", () => {
      resolve()
    })

    execProcess.on("exit", resolve)
  })

  const pdfFilePath = path.join(
    ...[...PROJECTS_PATH, project, OUTPUT_PROJECT_FOLDER_NAME],
    `${entryFileName}.pdf`
  )

  const pdfClientPath = !isDev ? "file:///" + path.join(
    ...[...PROJECTS_PATH, project, OUTPUT_PROJECT_FOLDER_NAME],
    `${entryFileName}.pdf`
  ) : path.join(
    ...[PROJECTS_PATH[2], project, OUTPUT_PROJECT_FOLDER_NAME],
    `${entryFileName}.pdf`)

  const logFilePath = path.join(outputPath, `${entryFileName}.log`)

  const log = await readFileAsync(logFilePath, { encoding: "utf8" })

  let resultLog = ""

  if (await existsAsync(resultFilePath)) {
    resultLog = await readFileAsync(resultFilePath, { encoding: "utf8" })
  }

  await new Promise((resolve) => setTimeout(resolve, 500))

  if (await existsAsync(pdfFilePath)) {
    return {
      hasError: false,
      log,
      resultLog,
      pdfClientPath: pdfClientPath,
    }
  } else {
    return {
      hasError: true,
      resultLog,
      log,
    }
  }
}
