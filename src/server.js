const argv = require('yargs').argv
const path = require('path')
const getPort = require('get-port')
const express = require('express')

const Api = require('./classes/Api')

// app
const app = express()
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

// api
;(async () => {
  const options = {
    root: argv.root || path.join(__dirname, '/../api'),
    port: argv.port || await getPort({ port: [3000, 3001, 3002] }),
    debug: argv.debug || false,
  }

  // configure api
  const api = new Api(options)

  // start
  api.start(app)
})()
