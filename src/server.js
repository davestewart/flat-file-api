const path = require('path')
const express = require('express')
const reload = require('reload')
const watch = require('watch')

const app = express()

const { processFile, getFile } = require('./services/file')
const { FileError } = require('./services/errors')

app.get('/', function (req, res) {
  return res.send('Showing index')
})

app.all('*', function (req, res) {
  let file
  try {
    file = getFile(root, req)
  }
  catch (error) {
    if (error instanceof FileError) {
      return res.status(500).send({ error })
    }
    throw error
  }
  if (file) {
    return processFile(file, req, res)
  }
  res.status(404)
  return res.send({ status: 404 })
})


const root = path.join(__dirname, '/../api')

app.listen(process.env.PORT || 8080)
