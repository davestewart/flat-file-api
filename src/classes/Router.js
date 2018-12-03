const fs = require('fs')

const ApiError = require('./ApiError')
const Endpoint = require('./Endpoint')
const log = require('../utils/logger')

module.exports = class Router {

  constructor (options) {
    this.root = options.root
    this.handlers = options.handlers
  }

  render (endpoint, req, res) {
    // if we have a file, handle its type
    if (endpoint) {
      // variables
      const { absPath, relPath, params } = endpoint
      const ext = absPath.replace(/^[^.]+./, '').toString()
      const handler = this.handlers[ext]

      // setup request
      req.params = params
      req.file = absPath

      // setup response
      res.set('X-Api-File-Path', relPath)

      // handle file
      if (handler) {
        return handler(req, res, absPath)
      }
    }
  }

  /**
   * Resolve a request to return the correct file path
   *
   * @param   {string}    route
   * @returns {File}
   */
  resolve (route) {

    //console.clear()

    // input
    const segments = route.replace(/^\/|\/$/g, '').split('/')

    // output
    let absPath = this.root
    let params = {}

    // process segments
    const found = segments.every((segment, index) => {

      // files
      const files = fs.readdirSync(absPath)
      const paramFiles = files.filter(file => /^_.+/.test(file))
      if (paramFiles.length > 1) {
        throw new ApiError(`A mock folder can only have one parameterized file or sub-folder`, absPath, 409)
      }

      // param (a folder or file which starts with an underscore)
      let param = null
      if (paramFiles.length === 1) {
        const paramFile = paramFiles[0]
        const paramPath = absPath + '/' + paramFile
        param = {
          name: paramFile.substr(1).replace(/\.\w+$/, ''),
          value: segment,
          file: paramFile.replace(/\.\w+$/, ''),
          absPath: paramPath,
          isFolder: fs.statSync(paramPath).isDirectory(),
          isFile: fs.statSync(paramPath).isFile(),
        }
      }

      // branch
      const isBranch = index < segments.length - 1
      if (isBranch) {

        // exact match
        const match = files.find(file => file === segment)
        if (match) {
          absPath += '/' + segment
          return true
        }

        // param match
        if (param && param.isFolder) {
          absPath = param.absPath
          params[param.name] = param.value
          return true
        }

        // no match at all
        return false
      }

      // leaf
      else {

        // update path
        absPath += '/'
        let filePath

        // debug
        // log('debugging', { files, param })

        // segment matches folder
        // console.log(`\nsegment '${segment}' matches folder`)
        if (files.includes(segment)) {
          filePath = this.find(absPath, segment)
          if (filePath) {
            absPath = filePath
            return true
          }
        }

        // param exists
        if (param) {

          // param file matches file
          // console.log(`\nparam.file '${param.file}' matches file`)
          filePath = this.find(absPath, param.file)
          if (filePath) {
            params[param.name] = param.value
            absPath = filePath
            return true
          }

          // param file matches folder
          // console.log(`\nparam.file '${param.file}' matches folder`)
          if (files.includes(param.file)) {
            filePath = this.find(absPath, param.file + '/index')
            if (filePath) {
              params[param.name] = param.value
              absPath = filePath
              return true
            }
          }
        }

        // segment matches file
        // console.log(`\nsegment '${segment}' matches file`)
        filePath = this.find(absPath, segment)
        if (filePath) {
          absPath = filePath
          return true
        }

        // segment matches folder
        // console.log(`\nsegment '${segment}' matches index`)
        filePath = this.find(absPath, segment + '/index')
        if (filePath) {
          absPath = filePath
          return true
        }

      }

    })

    // found
    if (found) {
      const relPath = absPath.replace(this.root, '')
      return new Endpoint(absPath, relPath, params)
    }
  }

  /**
   * Resolve a named file of a registered type from a folder
   *
   * @param   {string}  path
   * @param   {string}  name
   * @returns {string}
   */
  find (path, name) {
    // make sure path contains trailing slash
    path = path.replace(/\/*$/, '/')

    // generate file list using name and registered handler extensions
    const files = Object
      .keys(this.handlers)
      .map(ext => name + '.' + ext)

    // return the first file that exists
    return files
      .map(file => path + file)
      .find(filePath => {
        if (fs.existsSync(filePath)) {
          return true
        }
      })
  }

}

