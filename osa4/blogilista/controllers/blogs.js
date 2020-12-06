const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name:1 })
    response.json(blogs.map(blog => blog.toJSON()))

  /*
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
  */
})

blogsRouter.post('/', async (request, response, next) => {

  const body = request.body
  //console.log('body.userId: ', body.userId)

  if (!request.get('authorization')) {
    return response.status(401).json({
      error: 'Authorization header missing.',
    });
  }

  try {  
    //const user = await User.findById(body.userId)

    const token = getTokenFrom(request)
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    if (!body.title || !body.url) {
      // HUOM: return
      return response.status(400).json({
        error: 'title and url are mandatory properties'
      })
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
      user: user._id
    })
  
    // HUOM: ref in users list does not work without this!
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
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