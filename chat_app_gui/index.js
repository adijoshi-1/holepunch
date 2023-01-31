/* eslint-disable no-undef */

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const joinTopic = require('./config/peer')

const displayWindow = () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname) + '/middleware/preload.js',
    },
  })
  mainWindow.loadFile(path.join(__dirname) + '/pages/index.html')
}

app.whenReady().then(() => {
  displayWindow()
  ipcMain.on('test', (event, d) => console.log(d))
  joinTopic()
})
