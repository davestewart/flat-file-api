module.exports = req => {
  return {
    foo: 34567,
    absPath: req.absPath,
    originalUrl: req.originalUrl,
    params: req.params
  }
}
