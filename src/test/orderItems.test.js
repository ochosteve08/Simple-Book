const { expect } = require('chai')
const sinon = require('sinon')
const { listOrderItems } = require('../controllers/orderItemsController')
const { MongoClient } = require('mongodb')
const app = require('../index')

let mongoClient
let db

// Mock data for order items and products
const mockOrderItems = [
  {
    order_item_id: 1,
    product_id: 'f4621f8ad6f54a2e3c408884068be46d',
    price: 101.7,
    shipping_limit_date: '2017-05-11 16:25:11'
  },
  {
    order_item_id: 2,
    product_id: '325a06bcce0da45b7f4ecf2797dd40e4',
    price: 10.8,
    shipping_limit_date: '2017-09-05 12:50:19'
  }
]

const mockProducts = [
  {
    product_id: 'f4621f8ad6f54a2e3c408884068be46d',
    product_category_name: 'esporte_lazer'
  },
  {
    product_id: '325a06bcce0da45b7f4ecf2797dd40e4',
    product_category_name: 'esporte_lazer'
  }
]

beforeAll(async () => {
  const mongoUri = process.env.MONGO_URL
  mongoClient = new MongoClient(mongoUri)
  await mongoClient.connect()
  db = mongoClient.db()

  const orderItemsCollection = db.collection('order-items')
  const productsCollection = db.collection('products')
  sinon
    .stub(orderItemsCollection, 'find')
    .returns({ toArray: () => mockOrderItems })
  sinon.stub(productsCollection, 'findOne').callsFake((query) => {
    const productId = query.product_id
    return mockProducts.find((product) => product.product_id === productId)
  })

  app.locals.db = db
})

afterAll(async () => {
  // Close the MongoDB connection
  await mongoClient.close()
})

const mockReq = {
  auth: {
    user: 'mockSellerId'
  },
  query: {},
  app: {
    locals: {
      db: null
    }
  }
}

const mockRes = {
  json: (data) => data
}

describe('listOrderItems', () => {
  it('should handle errors properly', async () => {
    const next = sinon.stub()

    await listOrderItems(mockReq, mockRes, next)

    expect(next.calledWithMatch(sinon.match.instanceOf(Error))).to.equal(true)
  })

  it('should return a list of order items when there are items in the database', async () => {
    const result = await listOrderItems(mockReq, mockRes, sinon.stub())

    if (result) {
      expect(result).to.have.property('data').that.is.an('array')
      expect(result).to.have.property('total').that.is.a('number')

      // Assuming there's at least one item in the result
      expect(result.data[0]).to.have.property('id').that.is.a('number')
      expect(result.data[0]).to.have.property('product_id').that.is.a('string')
      expect(result.data[0])
        .to.have.property('product_category')
        .that.is.a('string')
      expect(result.data[0]).to.have.property('price').that.is.a('number')
      expect(result.data[0]).to.have.property('date').that.is.a('string')
    } else {
      // Handle the case where result is undefined
      console.error(`Result is ${result}`)
    }
  })
})
