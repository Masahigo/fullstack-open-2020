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

blogsRouter.delete('/:id', async (request, response) => {

  try {
    // https://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }

  blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      id: body.id
    }

    try {
      // https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
      const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
      response.json(updatedBlog.toJSON())
    } catch (error) {
      next(error)
    }

  })

})

module.exports = blogsRouter