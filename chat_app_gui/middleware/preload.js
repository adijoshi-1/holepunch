const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('test', {
  test: (data) => {
    ipcRenderer.send('test', data)
  },
})
