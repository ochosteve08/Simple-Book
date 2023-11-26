const { expect } = require('chai')
const sinon = require('sinon')

const { listOrderItems } = require('../controllers/orderItemsController')

const mockOrderItemsCollection = {
  find: () => ({
    sort: sinon.stub().returnsThis(),
    skip: sinon.stub().returnsThis(),
    limit: sinon.stub().returnsThis(),
    toArray: async () => [
      {
        order_item_id: 'mockOrderId',
        product_id: 'mockProductId',
        price: 50,
        shipping_limit_date: '2023-01-01'
      }
    ]
  }),
  countDocuments: async () => 1
}

const mockProductsCollection = {
  findOne: async () => ({
    product_category_name: 'MockCategory'
  })
}

const mockReq = {
  auth: {
    user: 'mockSellerId'
  },
  query: {},
  app: {
    locals: {
      db: {
        collection: (collectionName) => {
          if (collectionName === 'order-items') return mockOrderItemsCollection
          if (collectionName === 'products') return mockProductsCollection
          return null
        }
      }
    }
  }
}

const mockRes = {
  json: (data) => data
}

describe('listOrderItems', () => {
  it('should handle errors properly', async () => {
    let errorOccurred = false
    const next = (error) => {
      errorOccurred = true
    }

    mockProductsCollection.findOne = async () => {
      throw new Error('Mocked error')
    }

    await listOrderItems(mockReq, mockRes, next)

    expect(errorOccurred).to.equal(true)
  })
})

describe('deleteOrderItemById', () => {
  it('should delete an order item and return success message', async () => {})

  it('should handle invalid order item ID', async () => {})

  it('should handle order item not found', async () => {})
})
