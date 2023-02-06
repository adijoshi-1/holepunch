/* eslint-disable no-undef */

require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const path = require('path')

const PORT = process.env.PORT
const app = express()

app.use(bodyParser.json({ limit: '20mb' }))
app.use(bodyParser.urlencoded({ limit: '20mb', extended: false }))
app.use(cors())
app.use(morgan('dev'))

app.get('/', (req, res) =>
  res.status(200).sendFile(path.join(__dirname) + '/pages/index.html')
)
app.use(require('./app/routes'))

const server = app.listen(PORT, () => {
  const port = server.address().port
  console.log('Chat application server running at port:', port)
})
