// basicAuth.js
const basicAuth = require('express-basic-auth')

const basicAuthMiddleware = (req, res, next) => {
  const authorizer = async (username, password, cb) => {
    try {
      if (req.app.locals.db) {
        return cb(null, true)
      }

      const sellersCollection = req.app.locals.db.collection('sellers')
      const seller = await sellersCollection.findOne({ seller_id: username })

      if (!seller || seller.seller_zip_code_prefix !== password) {
        return cb(null, false)
      }

      return cb(null, true)
    } catch (error) {
      return cb(error)
    }
  }

  const middleware = basicAuth({
    authorizeAsync: true,
    unauthorizedResponse: 'Unauthorized Access',
    challenge: true,
    authorizer
  })

  middleware(req, res, next)
}

module.exports = basicAuthMiddleware
