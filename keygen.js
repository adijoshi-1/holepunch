const DHT = require('@hyperswarm/dht')
const b4a = require('b4a')

const keyPair = DHT.keyPair()

console.log('Public Key: ', b4a.toString(keyPair.publicKey, 'hex'))
console.log('Secret Key: ', b4a.toString(keyPair.secretKey, 'hex'))
