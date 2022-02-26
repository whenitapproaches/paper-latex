const { ipcRenderer } = require("electron")

export default async (project) => {
  return await ipcRenderer.invoke("download-project", project)
}
