const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

const Blog = require('./models/blog')

logger.info('connecting to', config.MONGODB_URI);
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.info('error connecting to MongoDB:', error.message);
  });

app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)
app.use('/api/blogs', blogsRouter)

// olemattomien osoitteiden käsittely
app.use(middleware.unknownEndpoint)
// virheellisten pyyntöjen käsittely
app.use(middleware.errorHandler)

module.exports = app