/* eslint-disable no-undef */

require('dotenv').config()
const DHT = require('@hyperswarm/dht')
const b4a = require('b4a')
const goodbye = require('graceful-goodbye')
const fs = require('fs')
const path = require('path')

const publicKey = b4a.from(process.env.PUBLIC_KEY, 'hex')
const secretKey = b4a.from(process.env.SECRET_KEY, 'hex')
const keyPair = { publicKey, secretKey }

const writeToFile = (data) => {
  fs.appendFile(path.join(__dirname) + '/file.txt', data, {}, (err) => {
    if (err) {
      console.log(err)
    }
  })
}

const dht = new DHT()
const server = dht.createServer((conn) => {
  console.log('Recevied Connection')
  conn.on('data', (data) => {
    writeToFile(b4a.toString(data, 'utf-8'))
  })
})

server.listen(keyPair).then(() => {
  console.log('Server Running: ', b4a.toString(publicKey, 'hex'))
})

goodbye(() => server.close())
