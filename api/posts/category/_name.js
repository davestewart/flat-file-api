module.exports = function (req, res, file) {
  return require('../index')
    .filter(post => post.category === req.params.name)
}
