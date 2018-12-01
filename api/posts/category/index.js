module.exports = function (req, res) {
  const { originalUrl, domain, method, baseUrl, params, query } = req
  return { originalUrl, domain, method, baseUrl, params, query }
}
