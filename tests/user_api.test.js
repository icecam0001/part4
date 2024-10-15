const bcrypt = require('bcrypt')
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')

const api = supertest(app)
const initialUsers = helper.initialUsers

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(initialUsers)
})

describe('User management', () => {
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const result = await api
      .post('/api/users')
      .send(helper.notUniqueUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('expected `username` to be unique'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    await api
      .post('/api/users')
      .send(helper.uniqueUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(helper.uniqueUser.username))
  })

  test('creation fails with proper statuscode and message if password is missing', async () => {
    const result = await api
      .post('/api/users')
      .send({ username: 'user3' })  // Ensure the payload structure is correct
      .expect(400)
      .expect('Content-Type', /application\/json/)
  
    assert(result.body.error.includes('password with at least 3 characters is required'))
  })

  test('creation fails with proper statuscode and message if password is too short', async () => {
    const result = await api
      .post('/api/users')
      .send({ username: 'user4', password: 'pw' }) // Ensure the payload structure is correct
      .expect(400)
      .expect('Content-Type', /application\/json/)
  
    assert(result.body.error.includes('password with at least 3 characters is required'))
  })
})

after(async () => {
  await mongoose.connection.close()
})