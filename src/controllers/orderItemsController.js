const { errorHandler } = require('../utils/errorHandler')
const { ObjectId } = require('mongodb')

const listOrderItems = async (req, res, next) => {
  try {
    const sellerId = req.auth.user

    const offset = parseInt(req.query.offset || 1)
    const limit = parseInt(req.query.limit) || 20
    const sort = req.query.sort
    const skip = (offset - 1) * limit
    console.log('Input parameters:', req.auth, req.query, req.app.locals.db)
    const orderItemsCollection = req.app.locals.db.collection('order-items')
    const productsCollection = req.app.locals.db.collection('products')

    const query = { seller_id: sellerId }

    const cursor = orderItemsCollection.find(query)

    // Sort the results if sort parameter is provided

    if (sort) {
      cursor.sort({ [sort]: 1 })
    }

    const total = await orderItemsCollection.countDocuments(query)
    const result = await cursor
      .skip(skip)
      .limit(limit)
      .toArray()

    const transformedResult = await Promise.all(
      result.map(async (orderItem) => {
        const product = await productsCollection.findOne({
          product_id: orderItem.product_id
        })

        return {
          id: orderItem.order_item_id,
          product_id: orderItem.product_id,
          product_category: product ? product.product_category_name : 'Unknown',
          price: orderItem.price,
          date: orderItem.shipping_limit_date
        }
      })
    )
    console.log('transformedResult:', transformedResult)

    res.json({
      data: transformedResult,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    })
  } catch (error) {
    next(error)
  }
}

const deleteOrderItemById = async (req, res, next) => {
  try {
    const sellerId = req.auth.user
    const orderItemId = req.params.id

    if (!ObjectId.isValid(orderItemId)) {
      return next(errorHandler(400, 'invalid parameter'))
    }
    const newOrderItemId = new ObjectId(orderItemId)

    console.log(sellerId, newOrderItemId)

    const orderItemsCollection = req.app.locals.db.collection('order-items')

    const result = await orderItemsCollection.findOneAndDelete({
      seller_id: sellerId,
      _id: newOrderItemId
    })

    if (!result) {
      return next(errorHandler(404, 'Order item not found'))
    }

    res.json({ message: 'Order item deleted successfully', result })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  listOrderItems,
  deleteOrderItemById
}
