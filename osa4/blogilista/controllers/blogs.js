const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })
  
  blogsRouter.post('/', async (request, response, next) => {
    
    const body = request.body

    if (!body.title && !body.url) {
      // HUOM: return
      return response.status(400).json({
        error: 'title and url are mandatory properties'
      })
    }
    
    const blog = new Blog(body)
    
    try {
      const result = await blog.save()
      response.status(201).json(result)
    } catch (error) {
      next(error)
    }
  })

module.exports = blogsRouter