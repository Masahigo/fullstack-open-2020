require('dotenv').config();
const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

const Blog = require('./models/blog')

app.use(cors())
app.use(express.json())

app.use(middleware.requestLogger)
app.use('/api/blogs', blogsRouter)

// olemattomien osoitteiden käsittely
app.use(middleware.unknownEndpoint)
// virheellisten pyyntöjen käsittely
app.use(middleware.errorHandler)

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})