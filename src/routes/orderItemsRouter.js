const express = require('express')
const orderItemsController = require('../controllers/orderItemsController')

const router = express.Router()

router.get('/', orderItemsController.listOrderItems)

router.delete('/:id', orderItemsController.deleteOrderItemById)

module.exports = router
