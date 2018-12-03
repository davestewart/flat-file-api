const argv = require('yargs').argv
const path = require('path')
const getPort = require('get-port')
const express = require('express')
const chalk = require('chalk')

const Api = require('./classes/Api')

// app
const app = express()
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

// api
async function start () {

  // get root
  const root = argv.root
    ? /^(\/|[a-z]:)/i.test(argv.root)
      ? argv.root
      : path.join(process.cwd(), argv.root)
    : path.join(__dirname, '/../api')

  // build options
  const options = {
    root: root,
    port: argv.port || await getPort({ port: [3000, 3001, 3002] }),
    debug: argv.debug || false,
  }

  // configure api
  const api = new Api(options)

  // start
  api.start(app)
}

start()
  .catch(error => {
    console.log(chalk.red('Error:', error.message))
  })
