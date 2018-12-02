function log (label, data) {
  if (log.enabled) {
    console.log(`${label}:`, JSON.stringify(data, null, '  ').replace(/"(.+)": /g, '$1 => '))
  }
}

log.enabled = false

module.exports = log
