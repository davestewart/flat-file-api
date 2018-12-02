const fs = require('fs')

const log = require('../utils/logger')
const Router = require('./Router')

// config
const { onIndex, onEndpoint } = require('../config/routes')
const defaultHandlers = require('../config/handlers')
const defaultOptions = {
  root: '',
  port: 3000,
  debug: false,
  handlers: {},
}

module.exports = class Api {

  constructor (options) {

    // debug
    log.enabled = !!options.debug

    // options
    this.options = Object.assign({}, defaultOptions, options)

    // ensure no trailing slash on root
    this.options.root = this.options.root.replace(/\/$/, '')

    // register all file handlers (ensuring no leading dots!)
    const input = Object.assign({}, defaultHandlers, options.handlers)
    this.options.handlers = Object
      .keys(input)
      .reduce((output, key) => {
        const ext = key.replace(/^\.*/, '')
        output[ext] = input[key]
        return output
      }, {})

    // router
    this.router = new Router(this.options)
  }

  start (app) {

    // start
    const options = this.options

    // routes
    app.get('/', onIndex(this.router))
    app.all('*', onEndpoint(this.router))

    // feedback
    console.log(`
Starting Flat File Api...

  - host:     http://localhost:${options.port}
  - root:     ${options.root}
  - handlers: ${Object.keys(options.handlers).join(', ')}
  - debug:    ${options.debug}
`)
    // check root exists
    if (!fs.existsSync(options.root)) {
      throw Error(`The supplied root ${options.root} does not exist`)
    }

    // start
    app.listen(options.port)
  }
}
