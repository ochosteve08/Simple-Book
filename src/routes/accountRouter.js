const express = require('express')
const accountController = require('../controllers/accountController')

const router = express.Router()

router.patch('/', accountController.updateAccount)

module.exports = router
