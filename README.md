# Part 4: Testing Express Servers, User Administration
This repository contains my submissions for Part 4 of the Full Stack Open 2024 course.
# Features

Backend unit testing

User authentication

Token-based authorization

Blog list application

# Technologies Used

Node.js

Express

MongoDB

Jest

Supertest

bcrypt

JSON Web Tokens

# API Endpoints
CopyGET /api/blogs - Fetch all blogs

POST /api/blogs - Create new blog (requires authentication)

DELETE /api/blogs/:id - Delete blog (requires authentication)

PUT /api/blogs/:id - Update blog

POST /api/users - Create new user

POST /api/login - Login user

# Setup and Installation

git clone https://github.com/icecam0001/part4.git

# Navigate to project directory
cd fullstack-part4

# Install dependencies
npm install

# Run tests
npm test

# Start the server
npm start
