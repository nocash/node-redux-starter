import Express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import cors from 'cors'
import morgan from 'morgan'

import routes from './routes'
import auth from './auth'

import db from './config/db' // eslint-disable-line no-unused-vars

const errorHandler = (error, req, res, next) => { // eslint-disable-line no-unused-vars
  if (error.status && error.message) {
    return res.status(error.status).send(error.message).end()
  }

  return res.status(500).send({
    message: 'Internal Server Error',
  }).end()
}

const app = new Express()

// Middleware
app.use(cors())
app.use(morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev'))
app.use(bodyParser.json({ type: ['application/json'] }))

// Routes
app.use('/api', routes)
app.use('/auth', auth)

// Serve static assets from /dist
app.use('/', Express.static(path.resolve(__dirname, '../dist')))

// Allow react-router to handle all other requests
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/index.html'))
})

// Error Handler catches bad API requests
app.use(errorHandler)

export default app
