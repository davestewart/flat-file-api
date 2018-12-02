const fs = require('fs')

const { log } = require('./utils')
const { FileError, File } = require('./classes')
const { fuzzyFindFile } = require('./files')

/**
 * Process a request to return the correct file path
 *
 * @param   {string}  root  The root path to start searching
 * @param   {string}  req
 * @returns {object}
 */
function processRequest (root, req) {

  console.clear()

  // input
  const url = req.params[0]
  const segments = url.replace(/^\/|\/$/g, '').split('/')

  // output
  let absPath = root
  let vars = {}

  // process segments
  const found = segments.every((segment, index) => {

    // files
    const files = fs.readdirSync(absPath)
    const params = files.filter(file => /^_.+/.test(file))
    if (params.length > 1) {
      throw new FileError(`A mock folder can only have one parameterized file or sub-folder`, absPath, 409)
    }

    // param (a folder or file which starts with an underscore)
    let param = null
    if (params.length === 1) {
      const paramFile = params[0]
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
        vars[param.name] = param.value
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
        filePath = fuzzyFindFile(absPath, segment)
        if (filePath) {
          absPath = filePath
          return true
        }
      }

      // param exists
      if (param) {

        // param file matches file
        // console.log(`\nparam.file '${param.file}' matches file`)
        filePath = fuzzyFindFile(absPath, param.file)
        if (filePath) {
          vars[param.name] = param.value
          absPath = filePath
          return true
        }

        // param file matches folder
        // console.log(`\nparam.file '${param.file}' matches folder`)
        if (files.includes(param.file)) {
          filePath = fuzzyFindFile(absPath, param.file + '/index')
          if (filePath) {
            vars[param.name] = param.value
            absPath = filePath
            return true
          }
        }
      }

      // segment matches file
      // console.log(`\nsegment '${segment}' matches file`)
      filePath = fuzzyFindFile(absPath, segment)
      if (filePath) {
        absPath = filePath
        return true
      }

      // segment matches folder
      // console.log(`\nsegment '${segment}' matches index`)
      filePath = fuzzyFindFile(absPath, segment + '/index')
      if (filePath) {
        absPath = filePath
        return true
      }

    }

  })

  // found
  if (found) {
    return new File(absPath, absPath.replace(root, ''), vars)
  }
}

module.exports = {
  processRequest,
}
