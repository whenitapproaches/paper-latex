const { ipcRenderer } = require("electron")

export default async ({ project, fileName }) => {
  return await ipcRenderer.invoke("create-file", { project, fileName })
}
