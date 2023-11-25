const request = require('supertest')
const app = require('../index')
const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)

const expect = chai.expect

describe('API Endpoints', () => {
  test('GET /order_items should return a list of order_items', async () => {
    const response = await request(app).get('/order_items')
    expect(response.status).to.equal(200)
    expect(response.body).toHaveProperty('data')
    expect(response.body.data).toBeInstanceOf(Array)

    // Assuming the response follows the provided format
    const orderItem = response.body.data[0]
    expect(orderItem).to.have.property('id')
    expect(orderItem).to.have.property('product_id')
    expect(orderItem).to.have.property('product_category')
    expect(orderItem).to.have.property('price')
    expect(orderItem).to.have.property('date')
  })

  test('PATCH /account', async () => {
    const updatedInfo = {
      city: 'New City',
      state: 'New State'
    }

    const response = await request(app)
      .patch('/account')
      .send(updatedInfo)

    expect(response.status).toBe(200)
    expect(response.body).to.have.property('new_city', 'New City')
    expect(response.body).to.have.property('new_state', 'New State')
  })

  test('DELETE /order_items/:id should delete the specified order item', async () => {
    const orderItemId = '65614786c1ba2a9df0dc209e'

    const response = await request(app)
      .delete(`/order_items/${orderItemId}`)
    expect(response.status).toBe(204)
  })
})
