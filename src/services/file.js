const fs = require('fs')

const { log } = require('./utils')
const { FileError } = require('./errors')

function findFile (path, files) {
  return files
    .map(file => path.replace(/\/*$/, '/') + file)
    .find(filepath => {
      console.log('checking FILE: ', filepath)
      if (fs.existsSync(filepath)) {
        console.log('FOUND!!', filepath)
        return true
      }
    })
}

function getParams (files) {
  // params
  const params = {
    file: files.filter(file => /^[_:][^.]+\.(js|json)$/.test(file)),
    folder: files.filter(file => /^[_:][^.]+$/.test(file)),
  }

  console.log('RUNNING!', params)

  // test duplicate folders
  if (params.folder.length > 1) {
    console.log('ERROR!')
    throw new FileError(`A mock folder can only have one parameterized sub-folder`, path, 409)
  }
  if (params.file.length > 1) {
    throw new FileError(`A mock folder can only have one parameterized file`, path, 409)
  }

  const varFile = params.file[0]
  const varFolder = params.folder[0]
}

module.exports.getFile = function (root, req) {
  const { domain, method, baseUrl, params, query } = req

  const url = params[0]
  const segments = url.replace(/^\/|\/$/g, '').split('/')

  let path = root
  let vars = {}

  log('finding', { domain, method, url, query, params, baseUrl })

  const found = segments.every((segment, index) => {
    // variables
    const isLast = index === segments.length - 1
    const isFolder = fs.statSync(path).isDirectory()
    const files = fs.readdirSync(path)

    // params
    const params = {
      file: files.filter(file => /^[_:][^.]+\.(js|json)$/.test(file)),
      folder: files.filter(file => /^[_:][^.]+$/.test(file)),
    }

    console.log('RUNNING!', params)

    // test duplicate folders
    if (params.folder.length > 1) {
      console.log('ERROR!')
      throw new FileError(`A mock folder can only have one parameterized sub-folder`, path, 409)
    }
    if (params.file.length > 1) {
      throw new FileError(`A mock folder can only have one parameterized file`, path, 409)
    }

    const varFile = params.file[0]
    const varFolder = params.folder[0]

    // traverse
    if (!isLast) {

      console.log('PROCESSING FOLDER', segment)

      // exact match
      const match = files.find(file => file === segment)
      if (match) {
        path += '/' + segment
        console.log('FOUND EXACT MATCH:', segment, path)
        return true
      }

      // variable match
      if (varFolder) {

        path += '/' + varFolder
        const varName = varFolder.substr(1)
        vars[varName] = segment
        console.log('FOUND VARIABLE MATCH:', segment, path)
        return true
      }

      console.log('NO FOLDER MATCH!')
      // do something here is crud

    }

    // final file
    else {

      path += '/'

      console.log('PROCESSING FILE...', segment)

      // param file
      if (varFile) {
        path += varFile
        const varName = varFile.substr(1).replace(/\.\w+$/, '')
        vars[varName] = segment
        console.log('FOUND VARIABLE MATCH:', segment, path)
        return true
      }

      // param folder
      if (varFolder) {
        const files = [
          varFolder + '/index.js',
          varFolder + '/index.json',
        ]
        const filepath = findFile(path, files)

        console.log('FILEPATH >>>>>>>>> :', filepath)
        console.log('PATH:', path)

        if (filepath) {
          console.log()
          console.log('found file!')

          const varName = varFolder.substr(1)
          vars[varName] = segment
          path = filepath

          return true
        }
      }

      // hardcoded files
      const files = [
        segment,
        segment + '.js',
        segment + '.json',
        segment + '.crud.json',
        segment + '/index.js',
        segment + '/index.json',
        segment + '/index.crud.json',
      ]

      // debug
      console.log('\nresolving file:', path)
      const filepath = findFile(path, files)
      if (filepath) {
        path = filepath
        console.log()
        console.log('found file!')
        return true
      }

    }

  })

  const results = {
    found,
    path,
    vars
  }

  console.log()
  log('results', results)

  // const filepath = path.join(__dirname, `api/${filename}.json`)
  if (found) {
    return results
  }
}

module.exports.processFile = function (file, req, res) {
  const { path, vars } = file
  if (path.endsWith('js')) {
    console.log('sending js file!')
    const js = require(path)
    if (js instanceof Function) {
      console.log('running function')
      req.params = vars
      return res.send(js(req, res))
    }

    else {
      return res.sendFile(path)
    }
  }
  return res.sendFile(path)

}
