class FileError extends Error {

  constructor (message, path, code) {
    super()
    this.message = message
    this.path = path
    this.code = code
  }
}

class File {

  constructor (absPath, relPath, vars) {
    this.absPath = absPath
    this.relPath = relPath
    this.vars = vars
  }

  /**
   * Process found file to return data
   *
   * @param   {Request}   req
   * @param   {Response}  res
   * @returns {*}
   */
  send (req, res) {
    const { absPath, relPath, vars } = this

    res.set('X-Api-File-Path', relPath)

    if (absPath.endsWith('.js')) {
      // console.log('sending js file!')
      const js = require(absPath)
      if (js instanceof Function) {
        // console.log('running function')
        req.params = vars
        return res.send(js(req, res))
      }

      else {
        return res.sendFile(absPath)
      }
    }
    return res.sendFile(absPath)

  }


}

module.exports = {
  FileError,
  File
}
