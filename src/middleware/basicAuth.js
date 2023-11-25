const basicAuth = require('express-basic-auth')

const { db } = require('../index')

const basicAuthMiddleware = basicAuth({
  authorizeAsync: true,
  unauthorizedResponse: 'Unauthorized Access',
  challenge: true,
  authorizer: async (username, password, cb) => {
    try {
      const sellersCollection = db.collection('sellers')
      const seller = await sellersCollection.findOne({ seller_id: username })

      if (!seller || seller.seller_zip_code_prefix !== password) {
        return cb(null, false)
      }

      return cb(null, true)
    } catch (error) {
      return cb(error)
    }
  }
})

module.exports = (req, res, next) => {
  basicAuthMiddleware(req, res, (err) => {
    if (err) {
      return next(err)
    }

    next()
  })
}
