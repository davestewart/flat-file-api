const faker = require('faker')

faker.seed(123);

module.exports = function (req, res) {
  const items = []
  const max = Number(req.query.items) || 100
  for (let id = 1; id <= max; id++) {
    const item = {
      id: id,
      title: faker.lorem.words(8, 20),
      content: faker.lorem.sentences(8, 20),
      author: {
        name: faker.name.findName(),
        email: faker.internet.email(),
      }
    }
    items.push(item)
  }
  return items
}
