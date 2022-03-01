const { ipcRenderer } = require("electron")

export default async ({ project, imageDataUrl }) => {
  return await ipcRenderer.invoke("insert-image", { project, imageDataUrl })
}
