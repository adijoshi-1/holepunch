const b4a = require('b4a')
const crypto = require('hypercore-crypto')

console.log(b4a.toString(crypto.randomBytes(32), 'hex'))
