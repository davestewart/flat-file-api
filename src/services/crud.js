const faker = require('faker')
const ejs = require('ejs')

const { clean } = require('../utils/object')

exports.generateItems = function (item, max = 100) {

  // setup
  // faker.seed(123);
  const numericId = item.id === 0

  // generate templates
  const templates = Object
    .keys(item)
    .reduce ((output, key) => {
      output[key] = ejs.compile(String(item[key]))
      return output
    }, {})

  // build items
  const items = []
  for (let id = 1; id <= Number(max); id++) {
    const item = {}
    for(let key in templates) {
      item[key] = templates[key]({faker, id})
    }
    if (numericId && item.id === '0') {
      item.id = id
    }
    items.push(item)
  }

  // return
  return items
}

exports.processRequest = function (req, res, items) {
  // data
  let id = String(req.params.id || req.query.id || '')
  let newItem = clean(req.body, Object.keys(items[0]), 'id')
  let oldItem = items.find(item => String(item.id) === id)

  // not found
  if (id && !oldItem) {
    res.status(404)
    return { status: 404 }
  }

  // found
  switch (req.method.toUpperCase()) {
    case 'GET':
      return id
        ? oldItem
        : items

    case 'POST':
      newItem.id = items.reduce((id, item) => item.id > id ? item.id : id, 0) + 1
      return newItem

    case 'PUT':
    case 'PATCH':
      return Object.assign(oldItem, newItem)

    case 'DELETE':
      return {
        status: 200
      }

    default:
      return '<error>'
  }

}
