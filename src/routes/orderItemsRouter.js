const express = require('express')
const orderItemsController = require('../controllers/orderItemsController')
const basicAuthMiddleware = require('../middleware/basicAuth')

const router = express.Router()

router.use(basicAuthMiddleware)

router.get('/', orderItemsController.listOrderItems)

router.delete('/:id', orderItemsController.deleteOrderItemById)

module.exports = router
