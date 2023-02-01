/* eslint-disable no-undef */

require('dotenv').config()
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const Hyperswarm = require('hyperswarm')
const b4a = require('b4a')
const goodbye = require('graceful-goodbye')

const topic = b4a.from(process.env.TOPIC, 'hex')
const swarm = new Hyperswarm()
const discovery = swarm.join(topic, { client: true, server: true })

const conns = []

goodbye(() => swarm.destroy())

const mainWindow = () => {
  const window = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname) + '/middleware/preload.js',
    },
  })

  swarm.on('connection', (conn) => {
    const name = b4a.toString(conn.remotePublicKey, 'hex')
    console.log('*Got Connection:', name, '*')
    conns.push(conn)
    conn.once('close', () => conns.splice(conns.indexOf(conn), 1))
    conn.on('data', (data) => {
      window.webContents.send(
        'message:received',
        name,
        b4a.toString(data, 'utf-8')
      )
    })
  })

  ipcMain.on('message:send', (event, message) => {
    for (const conn of conns) {
      conn.write(message)
    }
  })

  ipcMain.on('message:send', (event, message) =>
    window.webContents.send('update-counter', message)
  )
  window.loadFile(path.join(__dirname) + '/pages/index.html')
}

app.whenReady().then(async () => {
  await discovery.flushed()
  mainWindow()
})
