const { ipcRenderer } = require("electron")

export default async (imageDataUrl = null) => {
  return await ipcRenderer.invoke("insert-math", imageDataUrl)
}
