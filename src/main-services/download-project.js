const { dialog } = require("electron")
const fs = require("fs")

const yazl = require("yazl")

const path = require("path")

var noop = Function.prototype

const { app } = require("electron")

const isDev = process.env.IS_DEV == "true" ? true : false

const appPath = isDev ? app.getAppPath() : path.dirname(app.getPath("exe"))

const IGNORED_FILES = {
  __proto__: null,

  "$RECYCLE.BIN": true,
  "ehthumbs_vista.db": true,
  "ehthumbs.db": true,
  "Thumbs.db": true,
}

function defaultFilter(realPath, stats) {
  var basename = path.basename(realPath)
  return !(basename[0] === "." || basename in IGNORED_FILES)
}

function addDirectory(zip, realPath, metadataPath, filter, cb) {
  if (cb === undefined) {
    cb = filter
    filter = defaultFilter
  } else if (filter == null) {
    filter = defaultFilter
  }

  fs.lstat(realPath, function (error, stats) {
    if (error != null) {
      return cb(error)
    }

    if (stats.isDirectory() && filter(realPath, stats)) {
      fs.readdir(realPath, function (error, files) {
        if (error != null) {
          return cb(error)
        }

        var i = files.length
        var resolve = function (error) {
          if (error != null) {
            resolve = noop
            cb(error)
          } else if (--i === 0) {
            resolve = noop
            cb()
          }
        }
        files.forEach(function (file) {
          addDirectory(
            zip,
            path.join(realPath, file),
            metadataPath + "/" + file,
            filter,
            resolve
          )
        })
      })
    } else if (stats.isFile() && filter(realPath, stats)) {
      zip.addFile(realPath, metadataPath)
      cb()
    } else if (stats.isSymbolicLink() && filter(realPath, stats)) {
      return fs.readlink(realPath, function (error, target) {
        if (error != null) {
          return cb(error)
        }
        addDirectory(
          zip,
          path.resolve(path.dirname(realPath), target),
          metadataPath,
          filter,
          cb
        )
      })
    } else {
      cb() // ignored types
    }
  })
}

module.exports = async (project) => {
  const userChosenPath = await dialog.showSaveDialog({
    filters: [{ name: "Zip", extensions: ["zip"] }],
  })

  if (userChosenPath.filePath) {
    const filePath = userChosenPath.filePath

    const zip = new yazl.ZipFile()

    zip.outputStream.pipe(fs.createWriteStream(filePath))

    let projectPath = path.join(appPath, "public", "projects", project, "storage")

    fs.readdir(projectPath, async function (error, files) {
      await Promise.all(
        files.map(function (file) {
          return new Promise((resolve) => {
            addDirectory(
              zip,
              path.join(projectPath, file),
              file,
              function (realPath, stats) {
                return !stats.isSymbolicLink() && defaultFilter(realPath, stats)
              },
              function (error) {
                if (error) {
                  return console.error(error)
                }
                resolve()
              }
            )
          })
        })
      )

      zip.end()
    })

    return
  }
}
