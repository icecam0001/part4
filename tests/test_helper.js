const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
      title: 'First test blog',
      author: 'Tester One',
      url: 'http://testblog1.com',
      likes: 5
    },
    {
      title: 'Second test blog',
      author: 'Tester Two',
      url: 'http://testblog2.com',
      likes: 10
    }
  ]


const nonExistingId = async () => {
  const blog = new Blog({  title: '3rd blog',
  author: 'Tester three',
  url: 'http://testblog3.com',
  likes: 10})
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
  }
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
  }
  const initialUsers = [
    {
      username: 'user',
      passwordHash: 'secret',
      name:'jeff'
    },
    {
      username: 'user2',
      password: 'secret1',
      name:'jeff2'

    },
  ]
  
  const loginUser = {
    username: 'loginUser',
    password: 'secret',
    name:'jeff'

  }
  const uniqueUser = {
    username: 'unique',
    password: 'secret2',
    name:'jeff2'

  }
  
  const notUniqueUser = {
    username: 'user',
    password: 'secret',
    name:'jeff'
  }
  
  const userWithOutPassword = {
    username: 'user3',
    name:'jeff3'

  }
  
  const userWithTooShortPassword = {
    username: 'user4',
    password: 'pw',
    name:'jeff4'

  }
module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb, uniqueUser, notUniqueUser, userWithOutPassword, userWithTooShortPassword,initialUsers,loginUser
}