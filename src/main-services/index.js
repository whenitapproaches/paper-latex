const fs = require("fs")
const systemPath = require("path")
const { promisify } = require("util")

const readFileAsync = promisify(fs.readFile)

module.exports = {
  getFileContent: async (path) => {
    const BASE_PATH = ["public", "projects"]

    const joinedPath = systemPath.join(...[...BASE_PATH, ...path])

    return await readFileAsync(joinedPath, { encoding: "utf-8" })
  },
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
