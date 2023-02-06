const Corestore = require('corestore')
const Hyperdrive = require('hyperdrive')

const core = new Corestore('storage')
const drive = new Hyperdrive(core)

module.exports = { drive }
