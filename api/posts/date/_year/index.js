module.exports = req => {
  return require('../../index')
    .filter(post => post.date.startsWith(req.params.year))
}
