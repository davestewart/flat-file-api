module.exports = req => {
  const date = Object.values(req.params).join('/')
  return require('../../../index')
    .filter(post => post.date === date)
}
