module.exports = {

  'js': function (req, res, file) {
    const js = require(file)
    return js instanceof Function
      ? res.send(js(req, res, file))
      : res.sendFile(file)
  },

  'json': function (req, res, file) {
    return res.sendFile(file)
  },

  'crud.json': function (req, res, file) {
    return res.sendFile(file)
  }
}
