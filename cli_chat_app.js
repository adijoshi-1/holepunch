/* eslint-disable no-undef */

require('dotenv').config()
const Hyperswarm = require('hyperswarm')
const b4a = require('b4a')
const goodbye = require('graceful-goodbye')

const swarm = new Hyperswarm()
goodbye(() => swarm.destroy())

const conns = []
swarm.on('connection', (conn) => {
  const name = b4a.toString(conn.remotePublicKey, 'hex')
  console.log('* Got a connection from:', name, '*')
  conns.push(conn)
  conn.once('close', () => conns.splice(conns.indexOf(conn), 1))
  conn.on('data', (data) => console.log(`${name}: ${data}`))
})

process.stdin.on('data', (d) => {
  for (const conn of conns) {
    conn.write(d)
  }
})

const topic = b4a.from(process.env.TOPIC, 'hex')
const discovery = swarm.join(topic, { client: true, server: true })

discovery.flushed().then(() => {
  console.log('Joined Topic:', b4a.toString(topic, 'hex'))
})
