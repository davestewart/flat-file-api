module.exports.FileError = class FileError extends Error {

  constructor (message, path, code) {
    super()
    this.message = message
    this.path = path
    this.code = code
  }
}
