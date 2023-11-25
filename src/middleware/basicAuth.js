const basicAuth = require('express-basic-auth')

const { db } = require('../index')

const basicAuthMiddleware = basicAuth({
  users: async (username) => {
    const sellersCollection = db.collection('sellers')
    const seller = await sellersCollection.findOne({ seller_id: username })
    if (!seller) return null
    return { [seller.seller_id]: seller.seller_zip_code_prefix }
  },
  challenge: true,
  unauthorizedResponse: 'Unauthorized Access'
})

module.exports = basicAuthMiddleware
