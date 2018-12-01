module.exports.log = function (label, data) {
  console.log(`${label}:`, JSON.stringify(data, null, '  ').replace(/"(.+)": /g, '$1 => '))
}
