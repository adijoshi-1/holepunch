/* eslint-disable no-undef */

require('dotenv').config()
const DHT = require('@hyperswarm/dht')
const b4a = require('b4a')

const publicKey = b4a.from(process.env.PUBLIC_KEY, 'hex')

const dht = new DHT()
const conn = dht.connect(publicKey)

conn.once('open', () => {
  console.log('Connected to peer: ', b4a.toString(publicKey, 'hex'))
})

process.stdin.pipe(conn).pipe(process.stdout)
