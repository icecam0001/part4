const blogsRouter = require('express').Router()
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}
blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
    .find({}).populate('user', { username: 1})
        response.json(blogs)
      })
  

  blogsRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)
    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
  })
  
  blogsRouter.delete('/:id', async (request, response) => {
    try {
      const result = await Blog.findByIdAndDelete(request.params.id)
      if (result) {
        response.status(204).end()
      } else {
        response.status(404).json({ error: 'blog not found' })
      }
    } catch (error) {
      console.error('Error deleting blog:', error)
      response.status(400).json({ error: 'malformatted id' })
    }
  })
  blogsRouter.put('/:id', async (request, response) => {
    const { title, author, url, likes } = request.body
  
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id,
        { title, author, url, likes },
        { new: true, runValidators: true }
      )
  
      if (updatedBlog) {
        response.json(updatedBlog)
      } else {
        response.status(404).json({ error: 'blog not found' })
      }
    } catch (error) {
      console.error('Error updating blog:', error)
      response.status(400).json({ error: 'malformatted id' })
    }
  })
module.exports = blogsRouter