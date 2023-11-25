const express = require('express')
const accountController = require('../controllers/accountController')
const basicAuthMiddleware = require('../middleware/basicAuth')

const router = express.Router()

router.use(basicAuthMiddleware)

// Route to update seller's city or/and state
router.put('/', accountController.updateAccount)

module.exports = router
