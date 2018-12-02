const fs = require('fs')

const { log } = require('./utils')

/**
 * Check if any passed files exist in a path
 *
 * @param   {string}    path    The path to search for files in
 * @param   {string[]}  files   The list of files to check
 * @returns {string|undefined}
 */
function findFile (path, files) {
  return files
    .map(file => path.replace(/\/*$/, '/') + file)
    .find(filePath => {
      // console.log('checking FILE: ', filePath)
      if (fs.existsSync(filePath)) {
        // console.log('FOUND!!', filePath)
        return true
      }
    })
}

/**
 * Check if any passed file names exist in a path
 *
 * @param   {string}    path  The path to search for files in
 * @param   {string}    name  The name of the file to check
 * @param   {string[]}  exts  An optional array of extensions to search for
 * @returns {string}
 */
function fuzzyFindFile (path, name, exts = null) {
  exts = exts || [
    '.js',
    '.json',
    '.crud.json',
  ]
  const files = exts.map(ext => name + ext)
  // log('\nfuzzy find file', [path, name, files])
  return findFile(path, files)
}

module.exports = {
  findFile,
  fuzzyFindFile,
}
