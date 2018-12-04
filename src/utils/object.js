const _ = require('lodash')

exports.clean = function (item, pick = [], omit = []) {
  item = _.isObject(item) ? item : {}
  return _.pick(_.omit(item, omit), pick)
}

