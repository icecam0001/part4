const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const helper = require('./test_helper')

const api = supertest(app)
const Blog = require('../models/blog')

// Import initialBlogs from helper
const initialBlogs = helper.initialBlogs

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('should return blogs with right unique identifier property', async () => {
  const response = await api.get('/api/blogs')
  response.body.forEach((blog) => {
    assert(blog.id !== undefined, 'id should be defined')
    assert(blog._id === undefined, '_id should be undefined')
  })
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Bloggg',
    author: 'cameron the goat',
    url: 'youtube.com',
    likes: 100,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, initialBlogs.length + 1, 'A new blog should have been added')

  const titles = response.body.map(r => r.title)
  assert(titles.includes('Bloggg'), 'The new blog title should be in the response')
})

describe('deletion of a blog', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
  })

  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    console.log('Blogs at start:', blogsAtStart)

    const blogToDelete = blogsAtStart[1]
    console.log('Blog to delete:', blogToDelete)

    const response = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    console.log('Delete response:', response.status, response.text)

    const blogsAtEnd = await helper.blogsInDb()
    console.log('Blogs at end:', blogsAtEnd)

    assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1)
    const contents = blogsAtEnd.map(r => r.title)
    assert(!contents.includes(blogToDelete.title))
  })
})

describe('updating of a blog', () => {
  test('should update details of an existing blog successfully', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToBeUpdated = { ...blogsAtStart[0] }
    blogToBeUpdated.likes++

    await api
      .put(`/api/blogs/${blogToBeUpdated.id}`)
      .send(blogToBeUpdated)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

    const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToBeUpdated.id)
    assert.deepStrictEqual(updatedBlog, blogToBeUpdated)
  })
})

after(async () => {
  await mongoose.connection.close()
})