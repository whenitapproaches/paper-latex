const { ipcRenderer } = require("electron")

export default async () => {
  return await ipcRenderer.invoke("upload-project")
}
