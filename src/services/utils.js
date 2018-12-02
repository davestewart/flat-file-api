function log (label, data) {
  console.log(`${label}:`, JSON.stringify(data, null, '  ').replace(/"(.+)": /g, '$1 => '))
}

module.exports = {
  log
}
