module.exports = function (req, res) {
  return require('./index').find(post => post.id === Number(req.params.id)) || res.sendStatus(404)
}
