const { ipcRenderer } = require("electron")

export default async (project) => {
  return await ipcRenderer.invoke("create-project", project)
}
