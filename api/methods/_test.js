module.exports = req => {
  return req.method === 'GET'
    ? require('./test.json')
    : require('./test.post.json')
}
