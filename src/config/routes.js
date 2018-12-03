const glob = require('glob')
const ApiError = require('../classes/ApiError')

function onIndex (router) {
  return function (req, res) {
    glob(`${router.root}/**/*.{json,js,config.json}`, {mark: true}, function (error, paths) {
      const routes = paths
        .slice(1)
        .map(path => {
          return path
            .replace(router.root + '/', '')
            .replace(/\.\w+$/, '')
            .replace(/\/index$/, '')
        })
        .map (path => {
          try {
            const file = router.resolve(path)
            return {
              path: path.replace(/_/g, ':'),
              file: file.relPath
            }
          }
          catch (error) {
            return {
              path: '',
              file: ''
            }
          }
        })
      return res.render('index', { routes });
    })
  }
}

function onEndpoint (router) {
  return function (req, res) {
    // attempt to resolve and render endpoint
    try {
      const endpoint = router.resolve(req.params[0])
      if (endpoint) {
        return router.render(endpoint, req, res)
      }
    }

    // handle any errors
    catch (error) {
      if (error instanceof ApiError) {
        res.status(500).send({ error })
      }
      throw error
    }

    // otherwise, 404
    res.status(404)
    res.send({ status: 404 })
  }
}

module.exports = {
  onIndex,
  onEndpoint
}
