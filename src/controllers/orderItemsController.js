const { errorHandler } = require('../utils/errorHandler')

const listOrderItems = async (req, res, next) => {
  try {
    const sellerId = req.auth.user

    const offset = parseInt(req.query.offset || 1)
    const limit = parseInt(req.query.limit) || 20
    const sort = req.query.sort
    const skip = (offset - 1) * limit

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

module.exports = {
  listOrderItems
}

const deleteOrderItemById = async (req, res, next) => {
  try {
    const sellerId = req.auth.user
    const orderItemId = req.params.id

    const orderItemsCollection = req.app.locals.db.collection('order_items')

    const result = await orderItemsCollection.findOneAndDelete({
      seller_id: sellerId,
      _id: orderItemId
    })

    if (!result.value) {
      return next(errorHandler(404, 'Order item not found'))
    }

    res.json({ message: 'Order item deleted successfully' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  listOrderItems,
  deleteOrderItemById
}
