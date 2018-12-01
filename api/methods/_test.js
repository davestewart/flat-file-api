module.exports = req => {
  return req.method === 'GET'
    ? require('./test.post.json')
    : require('./test.json')
}
