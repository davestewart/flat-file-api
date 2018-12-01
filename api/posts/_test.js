module.exports = req => {
  return {
    foo: 34567,
    path: req.path,
    originalUrl: req.originalUrl,
    params: req.params
  }
}
