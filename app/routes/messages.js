const express = require('express')
const router = express.Router()
const { getMessagesList, sendMessage } = require('../controllers/messages')

router.get('/', getMessagesList)
router.post('/', sendMessage)

module.exports = router
