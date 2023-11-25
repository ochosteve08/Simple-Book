const express = require('express')
require('dotenv').config()
const { ConnectToDb, getDb } = require('./utils/db')
const swaggerUi = require('swagger-ui-express')
const swaggerJson = require('./doc/swagger.json')
const morgan = require('morgan')
const accountRouter = require('./routes/accountRouter')
const itemRouter = require('./routes/orderItemsRouter')

const app = express()
app.use(express.json())

app.get('/', (request, response) => {
  response.json({ message: 'endpoint is working' })
})

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJson))
app.get('/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerJson)
})

app.use(morgan('dev'))

let db

ConnectToDb((err) => {
  if (!err) {
    db = getDb()
    app.locals.db = db

    const basicAuthMiddleware = require('./middleware/basicAuth')
    app.use('/order_items', basicAuthMiddleware, itemRouter)
    app.use('/account', basicAuthMiddleware, accountRouter)

    app.listen(process.env.APP_PORT || 8000, (err) => {
      if (!err) {
        console.info(
          `Server running on ${process.env.APP_HOST}:${process.env.APP_PORT}`
        )
      } else {
        console.error('Error starting the server:', err)
      }
    })
  } else {
    console.error('Error connecting to MongoDB:', err)
  }
})
