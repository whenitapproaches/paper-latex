const fs = require("fs")

const { promisify } = require("util")

const existsAsync = promisify(fs.exists)

const writeFileAsync = promisify(fs.writeFile)

const mkdirAsync = promisify(fs.mkdir)

const path = require("path")

const { app } = require("electron")

const isDev = process.env.IS_DEV == "true" ? true : false

const appPath = isDev ? app.getAppPath() : path.dirname(app.getPath("exe"))

module.exports = async (projectName) => {
  const projectPath = path.join(appPath, "public", "projects", projectName, "storage")
  const outputPath = path.join(appPath, "public", "projects", projectName, "output")

  const projectMainFile = path.join(
    appPath,
    "public",
    "projects",
    projectName,
    "storage",
    "main.tex"
  )

  if (await existsAsync(projectPath)) {
    return {
      hasError: true,
      error: "project_name_exists",
    }
  }

  await mkdirAsync(projectPath, {
    recursive: true
  })

  await mkdirAsync(outputPath, {
    recursive: true
  })

  await writeFileAsync(
    projectMainFile,
    `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{graphicx}

\\title{Example title}
\\author{Author}
\\date{March 2022}

\\begin{document}

\\maketitle

\\section{Introduction}

\\end{document}
  `
  )

  return {
    hasError: false,
  }
}
