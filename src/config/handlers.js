const _ = require('lodash')
const { generateItems, processRequest } = require('../services/crud')

module.exports = {

  'js': function (req, res, file) {
    const js = require(file)
    return js instanceof Function
      ? js(req, res, file)
      : file
  },

  'crud.js': function (req, res, file) {
    const js = require(file)
    if (js instanceof Function) {
      const items = js(req, res, file)
      return processRequest(req, res, items)
    }
    return false
  },

  'json': function (req, res, file) {
    return file
  },

  'crud.json': function (req, res, file) {
    const json = require(file)
    const items = Array.isArray(json)
      ? json
      : _.isObject(json)
        ? generateItems(json, req.query.items || 100)
        : []
    return processRequest(req, res, items)
  }
}
