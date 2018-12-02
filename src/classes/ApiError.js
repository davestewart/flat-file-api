module.exports = class ApiError extends Error {

  constructor (message, path, code) {
    super()
    this.message = message
    this.path = path
    this.code = code
  }
}
