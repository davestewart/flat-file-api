const path = require('path')
const express = require('express')
const reload = require('reload')
const watch = require('watch')

const app = express()

const { processRequest } = require('./services/request')
const { FileError } = require('./services/classes')

app.get('/', function (req, res) {
  return res.send('Showing index')
})

app.all('*', function (req, res) {
  try {
    const file = processRequest(root, req)
    if (file) {
      return file.send(req, res)
    }
  }
  catch (error) {
    if (error instanceof FileError) {
      return res.status(500).send({ error })
    }
    throw error
  }
  res.status(404)
  return res.send({ status: 404 })
})


const root = path.join(__dirname, '/../api')

app.listen(process.env.PORT || 8080)
