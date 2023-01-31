/* eslint-disable no-undef */

require('dotenv').config()
const Hyperswarm = require('hyperswarm')
const b4a = require('b4a')
const goodbye = require('graceful-goodbye')

const topic = b4a.from(process.env.TOPIC, 'hex')

module.exports = () => {
  const swarm = new Hyperswarm()
  goodbye(() => swarm.destroy())

  const discovery = swarm.join(topic)
  discovery.flushed().then(() => {
    console.log('Joined Topic:', b4a.toString(topic, 'hex'))
  })
}
