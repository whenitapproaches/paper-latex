const path = require("path")
const url = require("url")
const { app, BrowserWindow, ipcMain } = require("electron")
const {
  getFileContent,
  getProjectsTree,
  insertMath,
  compileLatex,
  saveFile,
  insertImage,
  createFile,
  uploadProject,
  downloadProject,
  createProject,
} = require("./main-services")

const isDev = process.env.IS_DEV == "true" ? true : false

let mainWindow

ipcMain.handle("open-file", async (event, path) => {
  return await getFileContent(path)
})

ipcMain.handle("get-projects-file-trees", async (event) => {
  return await getProjectsTree()
})

ipcMain.handle("insert-math", async (event, imageDataUrl) => {
  return await insertMath(imageDataUrl)
})

ipcMain.handle("insert-image", async (event, { project, imageDataUrl }) => {
  return await insertImage({ project, imageDataUrl })
})

ipcMain.handle("upload-project", async (event) => {
  return await uploadProject()
})

ipcMain.handle("create-project", async (event, project) => {
  return await createProject(project)
})

ipcMain.handle("download-project", async (event, project) => {
  return await downloadProject(project)
})

ipcMain.handle("create-file", async (event, { project, fileName }) => {
  return await createFile({ project, fileName })
})

ipcMain.handle("save-file", async (event, payload) => {
  return await saveFile(payload)
})

ipcMain.handle("get-app-path", () => {
  if (isDev) {
    return {
      appPath: "",
      publicPath: "",
      resourcePath: "",
      publicResourcePath: "",
    }
  }

  const appPath = path.dirname(app.getPath("exe"))

  return {
    appPath,
    publicPath: process.platform === "darwin" ? path.resolve(appPath, "public") : path.resolve(appPath, "public"),
    resourcePath: path.resolve(appPath, "resources"),
    publicResourcePath: path.resolve(appPath, "resources", "public"),
  }
})

ipcMain.on("minimize-window", () => {
  mainWindow.minimize()
})
ipcMain.on("maximize-window", () => {
  mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
})
ipcMain.on("close-window", () => {
  mainWindow.close()
  app.quit()
})

ipcMain.on("compile", async (event, payload) => {
  const result = await compileLatex(payload)
  event.reply("compiled", result)
})

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    title: "PaperLatex",
    // frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  // and load the index.html of the app.
  // win.loadFile("index.html");
  console.log(__dirname)

  if (isDev) {
    mainWindow.loadURL("http://localhost:3000")
  } else {
    mainWindow.loadURL(url.format({
      pathname: path.join(app.getAppPath(), 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }
  
  // isDev
  //   : mainWindow.loadURL(path.join(__dirname, "../dist/index.html"))

  // mainWindow.loadURL(
  //   isDev
  //     ? "http://localhost:3000"
  //     : `file://${path.join(__dirname, "../src/index.html")}`
  // )
  // Open the DevTools.
  // if (isDev) {
  // mainWindow.webContents.openDevTools()
  // }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})
