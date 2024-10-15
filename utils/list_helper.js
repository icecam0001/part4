const dummy = (blogs) => {
    return 1
  }
  

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => sum + (blog.likes || 0); // Assuming each blog has a 'likes' property
  return blogs.reduce(reducer, 0); // Start with an initial sum of 0
}


module.exports = {
    dummy,
    totalLikes
  }